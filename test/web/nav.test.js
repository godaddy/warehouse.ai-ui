/* eslint-disable max-nested-callbacks */
import React from 'react';
import assume from 'assume';
import { mount } from 'enzyme';
import Nav from '../../src/components/nav';
import { MemoryRouter } from 'react-router-dom';

describe('Nav', function () {
  describe('renders a nav menu', function () {

    it('creates a complex nav', function () {
      const props = { path: '/something/really/super/crazy' };
      const tree = mount(
        <MemoryRouter>
          <Nav { ...props }><p>content</p></Nav>
        </MemoryRouter>
      );

      assume(tree.find('Breadcrumb').text()).equals('Home/something/really/super/crazy/');
      assume(tree.find('BreadcrumbItem').length).equals(5);
    });

    it('renders the content', function () {
      const props = { path: '/something/really/super/crazy' };
      const tree = mount(<MemoryRouter><Nav { ...props }><div id='content'>some content</div></Nav></MemoryRouter>);

      assume(tree.find('#content').length).equals(1);
      assume(tree.find('#content').text()).equals('some content');
    });

    it('creates the links', function () {
      const props = { path: '/something/really/super/crazy' };
      const tree = mount(
        <MemoryRouter>
          <Nav { ...props }><p>content</p></Nav>
        </MemoryRouter>
      );
      const links = tree.find('Link');

      assume(links.at(0).prop('to')).equals('/');
      assume(links.at(1).prop('to')).equals('/something');
      assume(links.at(2).prop('to')).equals('/something/really');
      assume(links.at(3).prop('to')).equals('/something/really/super');
      assume(links.at(4).prop('to')).equals('/something/really/super/crazy');
    });

    it('handles uri encoded path parts', function () {
      const props = { path: `/${encodeURIComponent('@scope/package')}/thing` };
      const tree = mount(
        <MemoryRouter>
          <Nav { ...props }><p>content</p></Nav>
        </MemoryRouter>
      );
      const links = tree.find('Link');

      assume(links.at(0).prop('to')).equals('/');
      assume(links.at(1).prop('to')).equals('/%40scope%2Fpackage');
      assume(links.at(2).prop('to')).equals('/%40scope%2Fpackage/thing');

      assume(tree.find('Breadcrumb').text()).equals('Home/@scope/package/thing/');
    });
  });
});
