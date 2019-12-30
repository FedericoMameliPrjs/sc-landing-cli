import template from 'lodash/template';
import gitUser from '../data/gitUser';

const urls = {
  // get create(){
  //   return template('http://<%= username %>@git.octopusmanagement.it:7990/scm/lpd/landing-page-starter.git')({
  //     username: gitUser.user
  //   });
  // },
  create: 'http://git.octopusmanagement.it:7990/scm/lpd/landing-page-starter.git',
  // clone: 'http://federico.mameli@git.octopusmanagement.it:7990/scm/lpd/landing-pages.git'
  get clone(){
    return template('http://<%= username %>@git.octopusmanagement.it:7990/scm/lpd/landing-pages.git')({
      username: gitUser.user
    });
  }
};

export default urls;
