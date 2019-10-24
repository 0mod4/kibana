/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { getActionType as getThresholdAlertType } from './threshold';
import { AlertTypeRegistry } from '../../../alert_type_registry';

export function registerAlertTypes({
  alertTypeRegistry,
}: {
  alertTypeRegistry: AlertTypeRegistry;
}) {
  alertTypeRegistry.register(getThresholdAlertType());
}
