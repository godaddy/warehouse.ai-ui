import React from 'react';
import { Layout } from 'antd';
import routes from './routes';
import { Route, Link } from 'react-router-dom';

const { Header, Content } = Layout;

export default () => (
  <Layout>
    <Header>
      <h1><Link to='/'>Warehouse.ai</Link></h1>
    </Header>

    <Content>
      { routes.map(route => <Route key={ route.name } { ...route } />) }
    </Content>
  </Layout>
);
