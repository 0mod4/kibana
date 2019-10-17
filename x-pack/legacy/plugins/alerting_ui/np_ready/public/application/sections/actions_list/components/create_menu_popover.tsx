/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React, { useContext, useState } from 'react';
import {
  EuiSpacer,
  EuiText,
  EuiFlexItem,
  EuiIcon,
  EuiFlexGroup,
  EuiButton,
  EuiPopover,
  EuiContextMenuPanel,
  EuiContextMenuItem,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { actionTypesSettings } from '../../../constants/action_types_settings';
import { ActionType } from '../../../lib/api';

interface Props {
  actionTypes: Record<string, ActionType>;
  createAction: (actionTypeItem: ActionType) => void;
}

export const AlertingActionsDropdown: React.FunctionComponent<Props> = ({
  actionTypes,
  createAction,
}) => {
  const [isPopoverOpen, setIsPopOverOpen] = useState<boolean>(false);

  const actions = Object.entries(!actionTypes ? [] : actionTypes).map(
    ([actionType, { id, name }]: any) => {
      const actionSettings = actionTypesSettings(id);
      const typeName = name;
      const iconClass = actionSettings.iconClass;
      const selectMessage = !actionSettings.selectMessage ? name : actionSettings.selectMessage;
      return {
        id,
        name,
        typeName,
        iconClass,
        selectMessage,
      };
    }
  );

  const button = (
    <EuiButton
      data-test-subj="addAlertingActionButton"
      fill
      iconType="arrowDown"
      iconSide="right"
      onClick={() => setIsPopOverOpen(!isPopoverOpen)}
    >
      <FormattedMessage
        id="xpack.alertingUI.sections.actions.addActionButtonLabel"
        defaultMessage="Add action"
      />
    </EuiButton>
  );

  return (
    <EuiPopover
      id="alertingActionPanel"
      button={button}
      isOpen={isPopoverOpen}
      closePopover={() => setIsPopOverOpen(false)}
      panelPaddingSize="none"
      anchorPosition="downLeft"
    >
      <EuiContextMenuPanel
        items={actions.map((action, index) => {
          const isActionDisabled = false;
          const description = action.selectMessage;
          return (
            <EuiContextMenuItem
              key={`${action.name}-${index}`}
              disabled={isActionDisabled}
              data-test-subj={`${action.name}ActionButton`}
              onClick={() => {
                setIsPopOverOpen(false);
                createAction(action);
              }}
            >
              <EuiFlexGroup>
                <EuiFlexItem grow={false} className="watcherThresholdWatchActionContextMenuItem">
                  <EuiIcon type={action.iconClass} />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <strong>{action.typeName}</strong>
                  <EuiSpacer size="xs" />
                  <EuiText size="s">
                    <p>{description}</p>
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiContextMenuItem>
          );
        })}
      />
    </EuiPopover>
  );
};
