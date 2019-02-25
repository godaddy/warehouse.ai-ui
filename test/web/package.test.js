import React from 'react';
import assume from 'assume';
import { mount } from 'enzyme';
import { Package } from '../../src/components/package';
import { MemoryRouter } from 'react-router-dom';

describe('Package', function () {
  describe('render package data', function () {
    const props = {
      pkg: {
        name: 'pkg1',
        dev: {
          env: 'dev',
          version: '2.1.0',
          status: {
            complete: true,
            progress: { percentage: 100 }
          }
        },
        test: {
          env: 'test',
          version: '2.0.0',
          status: {
            complete: true,
            progress: { percentage: 100 }
          }
        },
        prod: {
          env: 'prod',
          version: '1.1.0',
          status: {
            complete: true,
            progress: { percentage: 100 }
          }
        }
      }
    };

    let tree;

    beforeEach(function () {
      tree = mount(<MemoryRouter><Package { ...props }/></MemoryRouter>);
    });

    it('renders a loading message', function () {
      tree = mount(<MemoryRouter><Package loading/></MemoryRouter>);
      assume(tree.text()).equals('Loading...');
    });

    it('renders an error message', function () {
      tree = mount(<MemoryRouter><Package error={{ message: 'unable to find package' }}/></MemoryRouter>);
      assume(tree.text()).equals('Unable to load package information.');
    });

    it('renders the package header', function () {
      const pkg = tree.find('List');

      assume(pkg.find('h3').text()).contains('pkg1');
    });

    it('renders each environment', function () {
      const envs = tree.find('List Item Meta');
      assume(envs.length).equals(3);

      assume(envs.at(0).html()).contains('dev@2.1.0');
      assume(envs.at(1).html()).contains('test@2.0.0');
      assume(envs.at(2).html()).contains('prod@1.1.0');
    });

    it('renders status information for each environment', function () {
      const envs = tree.find('List Item Meta Progress');
      assume(envs.length).equals(3);

      assume(envs.at(0).prop('percent')).equals(100);
      assume(envs.at(0).prop('status')).equals('success');

      assume(envs.at(1).prop('percent')).equals(100);
      assume(envs.at(1).prop('status')).equals('success');

      assume(envs.at(2).prop('percent')).equals(100);
      assume(envs.at(2).prop('status')).equals('success');
    });

    it('displays the status unavailable message when there is no status information', function () {
      const noStatusProps = {
        pkg: {
          name: 'pkg1',
          dev: {
            env: 'dev',
            version: '2.1.0',
            status: null
          }
        }
      };

      tree = mount(<MemoryRouter><Package { ...noStatusProps }/></MemoryRouter>);

      assume(tree.find('List Item Meta Progress')).empty();
      assume(tree.find('List Item Meta p').text()).equals('Build status information unavailable.');
    });

    it('doesn\'t render null envs', function () {
      const noDev = {
        pkg: {
          name: 'pkg1',
          dev: null,
          test: {
            env: 'test',
            version: '2.1.0',
            status: {
              complete: true,
              progress: { percentage: 100 }
            }
          }
        }
      };

      tree = mount(<MemoryRouter><Package { ...noDev }/></MemoryRouter>);

      assume(tree.find('List Item Meta').length).equals(1);
      assume(tree.find('List Item Meta').html()).contains('test@2.1.0');
      assume(tree.find('List Item Meta').html()).not.contains('dev');
    });
  });
});
