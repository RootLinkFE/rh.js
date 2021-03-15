/* eslint-disable arrow-parens */
/**
 * fetch all templates
 */

import { GroupProjects } from '@gitbeaker/node';
import { getGitLabConfig } from '../../gitlab/index';

export function listTemplates() {
  const inst = new GroupProjects(getGitLabConfig());
  return inst
    .all(70)
    .then(res => res.filter(pj => pj.name.startsWith('rh-template-')));
}

export default { listTemplates };
