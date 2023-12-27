import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from sigma.exceptions import SigmaConditionError, SigmaError
from sigma.collection import SigmaCollection
from sigma.plugins import InstalledSigmaPlugins
from sigma.validation import SigmaValidator
from collections import Counter

import yaml

app = Flask(__name__)
CORS(app)

# Autodiscover plugins
plugins = InstalledSigmaPlugins.autodiscover()
backends = plugins.backends
pipelines = plugins.pipelines
pipeline_resolver = plugins.get_pipeline_resolver()
validators = plugins.validators


def convert_rules_to_query(target, pipeline_identifiers=None, input_paths=None, format="default", skip_unsupported=False):
    # Resolve pipelines if provided
    processing_pipelines = pipeline_resolver.resolve(pipeline_identifiers, target) if pipeline_identifiers else None

    # Initialize backend
    backend_class = backends[target]
    backend = backend_class(
        processing_pipeline=processing_pipelines,
        collect_errors=skip_unsupported,
    )
    # Load Sigma rules
    rule_collection = SigmaCollection.load_ruleset(input_paths)

    # Perform conversion
    try:
        result = backend.convert(rule_collection, format)
        return result
    except Exception as e:
        raise ValueError(f"Error during conversion: {str(e)}")
    

def check_sigma_rules(input_files, validation_config=None, exclude=None):
    if validation_config is None:
        exclude_lower = [excluded.lower() for excluded in (exclude or [])]
        validators_filtered = [
            validator
            for validator in validators.values()
            if validator.__name__.lower() not in exclude_lower
        ]
        rule_validator = SigmaValidator(validators_filtered)
    else:
        rule_validator = SigmaValidator.from_yaml(validation_config.read(), validators)

    try:
        rule_collection =  SigmaCollection.load_ruleset(input_files) 
        rule_errors = Counter()
        cond_errors = Counter()
        check_rules = list()
        for rule in rule_collection.rules:
            if len(rule.errors) > 0:
                for error in rule.errors:
                    rule_errors.update((error.__class__.__name__,))
            else:
                try:
                    for condition in rule.detection.parsed_condition:
                        condition.parse()
                    check_rules.append(rule)
                except SigmaConditionError as e:
                    error = str(e)
                    cond_errors.update((error,))

        rule_error_count = sum(rule_errors.values())
        cond_error_count = sum(cond_errors.values())
        issues = rule_validator.validate_rules(check_rules)
        issue_count = len(issues)

        # Output the results
        result_summary = {
            "rule_errors": rule_errors,
            "cond_errors": cond_errors,
            "issues": issues,
            "rule_error_count": rule_error_count,
            "cond_error_count": cond_error_count,
            "issue_count": issue_count,
        }

        return result_summary

    except SigmaError as e:
        return {"error": str(e)}


@app.route('/convert_rules', methods=['POST'])
def convert_rules():
    try:
        data = request.json
        target_backend = data.get('targetBackend')
        pipeline_ids = data.get('pipelineIds', None)  # Set to None if not present
        input_files = data.get('inputFiles')

        # Save Sigma rules to a temporary file
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix=".yaml") as temp_file:
            temp_file.write('\n'.join(input_files))

        conversion_result = convert_rules_to_query(target_backend, pipeline_ids, [temp_file.name])

        # Remove the temporary file
        temp_file_path = temp_file.name
        temp_file.close()
        os.remove(temp_file_path)

        return jsonify({'result': conversion_result})

    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'})


@app.route('/validate_rules', methods=['POST'])
def validate_rules():
    try:
        data = request.json
        
        input_files = data.get('yamlContent')
        
        if not input_files:
            return jsonify({'error': 'Input files not provided'})
        
        try:
            yaml_data = yaml.safe_load(input_files)
        except yaml.YAMLError as e:
            return jsonify({'error': 'Invalid YAML format'})

        # Perform Sigma rules validation
        result = check_sigma_rules(yaml_data)

        return jsonify({'validation_result' : result})

    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True)
