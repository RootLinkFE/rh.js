import { Api as Common } from './Common/Api';
import { Api as Project } from './Project/Api';

const RhApi = {
  Common: new Common(),
  Project: new Project(),
};

export default RhApi;
