import React from 'react';
import assume from 'assume';
import { mount } from 'enzyme';
import { Packages } from '../../src/components/packages';
import { MemoryRouter } from 'react-router-dom';

describe('Packages', function () {
  it('renders without data', function () {
    const tree = mount(<Packages />);

    assume(tree.html()).contains('No Data');
  });

  describe('render package data', function () {
    const props = {
      packages: [{
        name: 'pkg1',
        version: '1.2.0',
        description: 'some package',
        dev: {
          env: 'dev',
          version: '1.1.0',
          status: {
            complete: true,
            progress: { percentage: 100 }
          }
        }
      }, {
        name: 'pkg2',
        version: '2.2.0',
        description: 'some other package',
        dev: {
          env: 'dev',
          version: '2.2.0',
          status: {
            complete: true,
            error: { message: 'build failed' },
            progress: { percentage: 100 }
          }
        },
        prod: {
          env: 'prod',
          version: '2.1.0',
          status: {
            complete: false,
            error: { message: 'build failed' },
            progress: { percentage: 10 }
          }
        }
      }],
      cacheTime: '2018-11-08T22:18:10.471Z'
    };

    let tree;

    beforeEach(function () {
      tree = mount(<MemoryRouter><Packages { ...props }/></MemoryRouter>);
    });

    it('renders a loading message', function () {
      tree = mount(<MemoryRouter><Packages loading/></MemoryRouter>);
      assume(tree.text()).equals('Loading...');
    });

    it('renders an error message', function () {
      tree = mount(<MemoryRouter><Packages error={{ message: 'Packages not found' }}/></MemoryRouter>);
      assume(tree.text()).equals('Unable to load packages.');
    });

    it('renders the cache timing info', function () {
      assume(tree.find('.packages-footer').text()).contains(`Package data refreshed at ${new Date('2018-11-08T22:18:10.471Z')}`);
    });

    it('renders the correct number of package', function () {
      const pkgItems = tree.find('.package-card').hostNodes();
      assume(pkgItems.length).equals(2);

      assume(pkgItems.at(0).find('Link').text()).contains('pkg1@1.2.0');
      assume(pkgItems.at(0).find('Link').prop('to')).equals('/pkg1');
      assume(pkgItems.at(0).html()).contains('some package');

      assume(pkgItems.at(1).find('Link').text()).contains('pkg2@2.2.0');
      assume(pkgItems.at(1).find('Link').prop('to')).equals('/pkg2');
      assume(pkgItems.at(1).html()).contains('some other package');
    });

    it('renders the envs', function () {
      const pkgItems = tree.find('.env-card').hostNodes();
      assume(pkgItems.length).equals(3);

      assume(pkgItems.at(0).html()).contains('dev');
      assume(pkgItems.at(0).html()).contains('1.1.0');

      assume(pkgItems.at(1).html()).contains('dev');
      assume(pkgItems.at(1).html()).contains('2.2.0');

      assume(pkgItems.at(2).html()).contains('prod');
      assume(pkgItems.at(2).html()).contains('2.1.0');
    });

    it('renders status information for each env', function () {
      const pkgItems = tree.find('.env-card Progress');
      assume(pkgItems.at(0).prop('percent')).equals(100);
      assume(pkgItems.at(0).prop('status')).equals('success');
      assume(pkgItems.at(0).prop('size')).equals('small');

      assume(pkgItems.at(1).prop('percent')).equals(100);
      assume(pkgItems.at(1).prop('status')).equals('exception');
      assume(pkgItems.at(1).prop('size')).equals('small');

      assume(pkgItems.at(2).prop('percent')).equals(10);
      assume(pkgItems.at(2).prop('status')).equals('exception');
      assume(pkgItems.at(2).prop('size')).equals('small');
    });

    it('only renders the progress bar if there is status info', function () {
      const noStatusProps = {
        packages: [{
          name: 'pkg1',
          version: '1.2.0',
          description: 'some package',
          dev: {
            env: 'dev',
            version: '1.1.0',
            status: null
          }
        }]
      };

      tree = mount(<MemoryRouter><Packages { ...noStatusProps }/></MemoryRouter>);

      assume(tree.find('.env-card Progress')).empty();
    });

    it('properly renders null versions', function () {
      const nullVersionProps = {
        packages: [{
          name: 'pkg1',
          version: '1.2.0',
          description: 'some package',
          dev: {
            env: 'dev',
            version: null,
            status: null
          }
        }]
      };

      tree = mount(<MemoryRouter><Packages { ...nullVersionProps }/></MemoryRouter>);

      assume(tree.find('.env-card p').text()).equals('null');
    });
  });
});
