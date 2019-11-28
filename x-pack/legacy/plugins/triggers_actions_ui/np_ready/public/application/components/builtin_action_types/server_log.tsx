/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React, { Fragment } from 'react';
import { i18n } from '@kbn/i18n';
import { EuiSelect, EuiTextArea } from '@elastic/eui';
import { ActionTypeModel, ValidationResult, ActionParamsProps } from '../../../types';
import { ErrableFormRow } from '../page_error';

export function getActionType(): ActionTypeModel {
  return {
    id: '.server-log',
    iconClass: 'logsApp',
    selectMessage: i18n.translate(
      'xpack.triggersActionsUI.components.builtinActionTypes.serverLogAction.selectMessageText',
      {
        defaultMessage: 'Add an item to the logs.',
      }
    ),
    validateConnector: (): ValidationResult => {
      return { errors: {} };
    },
    validateParams: (actionParams: any): ValidationResult => {
      const validationResult = { errors: {} };
      return validationResult;
    },
    actionConnectorFields: null,
    actionParamsFields: ServerLogParamsFields,
  };
}

export const ServerLogParamsFields: React.FunctionComponent<ActionParamsProps> = ({
  action,
  editAction,
  index,
  errors,
  hasErrors,
}) => {
  const { message, level } = action;
  const levelOptions = [
    { value: 'trace', text: 'Trace' },
    { value: 'debug', text: 'Debug' },
    { value: 'info', text: 'Info' },
    { value: 'warn', text: 'Warning' },
    { value: 'error', text: 'Error' },
    { value: 'fatal', text: 'Fatal' },
  ];

  return (
    <Fragment>
      <ErrableFormRow
        id="loggingLevel"
        errorKey="level"
        fullWidth
        errors={errors}
        isShowingErrors={hasErrors && level !== undefined}
        label={i18n.translate(
          'xpack.triggersActionsUI.components.builtinActionTypes.serverLogAction.logLevelFieldLabel',
          {
            defaultMessage: 'Level',
          }
        )}
      >
        <EuiSelect
          fullWidth
          id="loggLevelSelect"
          data-test-subj="loggingLevelSelect"
          options={levelOptions}
          value={level}
          onChange={e => {
            editAction('level', e.target.value, index);
          }}
        />
      </ErrableFormRow>
      <ErrableFormRow
        id="loggingMessage"
        errorKey="message"
        fullWidth
        errors={errors}
        isShowingErrors={hasErrors && message !== undefined}
        label={i18n.translate(
          'xpack.triggersActionsUI.components.builtinActionTypes.serverLogAction.logMessageFieldLabel',
          {
            defaultMessage: 'Message',
          }
        )}
      >
        <EuiTextArea
          fullWidth
          value={message || ''}
          name="message"
          data-test-subj="loggingMessageInput"
          onChange={e => {
            editAction('message', e.target.value, index);
          }}
        />
      </ErrableFormRow>
    </Fragment>
  );
};
