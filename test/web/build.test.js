/* eslint-disable max-nested-callbacks */
import React from 'react';
import assume from 'assume';
import { mount } from 'enzyme';
import { Build } from '../../src/components/build';
import { MemoryRouter } from 'react-router-dom';

describe('Build', function () {
  describe('render build data', function () {
    const props = {
      build: {
        name: '@scope/pkgName',
        version: '9.6.0',
        env: 'test',
        buildId: '@scope/pkgName!test!9.6.0!en-US',
        previousBuildId: '@scope/pkgName!test!9.5.2!en-US',
        createDate: '2018-12-03T18:28:14.876Z',
        updateDate: '2018-12-03T18:28:14.933Z',
        files: [
          'https://wrhs.ai/wrhs-assets/759966d00b135/code.js',
          'https://wrhs.ai/wrhs-assets/9a946332d7caf/styles.css'
        ],
        status: {
          complete: true,
          events: [{
            error: false,
            message: 'start the buildy build build',
            locale: null,
            createDate: '2018-12-03T18:28:14.876Z'
          }, {
            error: false,
            message: 'buildy build build',
            locale: 'en-US',
            createDate: '2018-12-03T18:29:14.876Z'
          }, {
            error: true,
            message: 'can\'t buildy build build',
            locale: 'en-US',
            createDate: '2018-12-03T18:30:14.876Z'
          }]
        }
      }
    };

    let tree;

    beforeEach(function () {
      tree = mount(<MemoryRouter><Build { ...props }/></MemoryRouter>);
    });

    it('renders a loading message', function () {
      tree = mount(<MemoryRouter><Build loading/></MemoryRouter>);
      assume(tree.text()).equals('Loading...');
    });

    it('renders an error message', function () {
      tree = mount(<MemoryRouter><Build error={{ message: 'Build not found' }}/></MemoryRouter>);
      assume(tree.text()).equals('Unable to load build information.');
    });

    it('renders the package header', function () {
      assume(tree.find('Card .ant-card-head-title').text()).equals('@scope/pkgName@9.6.0 test');
    });

    describe('build information', function () {
      const rows = ['Created', 'Updated', 'Build Id', 'Previous Build Id', 'Files'];

      it('renders the build information', function () {
        const renderedRows = tree.find('Card Row');

        assume(renderedRows.length).equals(rows.length);
        renderedRows.forEach((renderedRow, index) => {
          assume(renderedRow.find('Col').at(0).text()).equals(rows[index]);
        });
      });

      rows.forEach((title, index) => {
        const expectedContent = [
          new Date('2018-12-03T18:28:14.876Z').toString(), // created
          new Date('2018-12-03T18:28:14.933Z').toString(), // updated
          '@scope/pkgName!test!9.6.0!en-US',  // build id
          '@scope/pkgName!test!9.5.2!en-US',  // prev build id
          'https://wrhs.ai/wrhs-assets/759966d00b135/code.jshttps://wrhs.ai/wrhs-assets/9a946332d7caf/styles.css' // files
        ];

        it(`renders the ${title}`, function () {
          const contentCol = tree.find('Card Row').at(index).find('Col').at(1);
          assume(contentCol.text()).equals(expectedContent[index]);
        });
      });

      it('renders the previous build as a link', function () {
        const link = tree.find('Card Row').at(3).find('Link');

        assume(link.prop('to')).equals(`/${encodeURIComponent('@scope/pkgName')}/test/9.5.2`);
      });
    });

    describe('Build log', function () {
      it('renders the build log title', function () {
        assume(tree.find('Divider').text()).equals('Build Log');
      });

      it('renders each build event', function () {
        const items = tree.find('TimelineItem');
        assume(items.length).equals(3);
      });

      it('renders an event without a locale', function () {
        const item = tree.find('TimelineItem').at(0);

        assume(item.prop('color')).equals('green');

        ['start the buildy build build', new Date('2018-12-03T18:28:14.876Z').toString()].forEach((expectedColText, index) => {
          assume(item.find('Row Col').at(index).text()).contains(expectedColText);
        });

        assume(item.find('Row Col').at(0).prop('span')).equals(8);
        assume(item.find('Row Col').at(1).prop('span')).equals(16);
      });

      it('renders a locale event', function () {
        const item = tree.find('TimelineItem').at(1);

        assume(item.prop('color')).equals('green');

        ['buildy build build', 'en-US', new Date('2018-12-03T18:29:14.876Z').toString()].forEach((expectedColText, index) => {
          assume(item.find('Row Col').at(index).text()).contains(expectedColText);
        });

        assume(item.find('Row Col').at(0).prop('span')).equals(6);
        assume(item.find('Row Col').at(1).prop('span')).equals(2);
        assume(item.find('Row Col').at(2).prop('span')).equals(16);
      });

      it('renders an error event', function () {
        const item = tree.find('TimelineItem').at(2);

        assume(item.prop('color')).equals('red');

        ['can\'t buildy build build', 'en-US', new Date('2018-12-03T18:30:14.876Z').toString()].forEach((expectedColText, index) => {
          assume(item.find('Row Col').at(index).text()).contains(expectedColText);
        });

        assume(item.find('Row Col').at(0).prop('span')).equals(6);
        assume(item.find('Row Col').at(1).prop('span')).equals(2);
        assume(item.find('Row Col').at(2).prop('span')).equals(16);
      });
    });
  });
});
