/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Legacy } from 'kibana';
import { Root } from 'joi';
import { resolve } from 'path';

export function alertingUI(kibana: any) {
  return new kibana.Plugin({
    id: 'alerting_ui',
    configPrefix: 'xpack.alerting_ui',
    publicDir: resolve(__dirname, 'public'),
    require: ['kibana', 'actions'],
    isEnabled(config: Legacy.KibanaConfig) {
      return config.get('xpack.alerting_ui.enabled') && config.get('xpack.actions.enabled');
    },
    config(Joi: Root) {
      return Joi.object()
        .keys({
          enabled: Joi.boolean().default(false),
        })
        .default();
    },
    uiExports: {
      hacks: ['plugins/alerting_ui/hacks/register'],
      managementSections: ['plugins/alerting_ui'],
    },
  });
}
