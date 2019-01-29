/* eslint-disable max-nested-callbacks, max-statements */
const assume = require('assume');
const sinon = require('sinon');
assume.use(require('assume-sinon'));

const schema = require('../../../lib/schema');
const { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLEnumType } = require('graphql');


describe('schema', function () {
  it('exposes the root fields', function () {
    const rootFields = schema.getQueryType().getFields();
    assume(rootFields).hasOwn('packages');
    assume(rootFields.packages.type).instanceOf(GraphQLList);
    assume(rootFields.packages.type.ofType.name).equals('Package');

    assume(rootFields).hasOwn('build');
    assume(rootFields.build.type).instanceOf(GraphQLObjectType);
    assume(rootFields.build.type.name).equals('Build');

    assume(rootFields).hasOwn('cacheTimes');
  });

  it('Package', function () {
    const packageType = schema.getType('Package');
    const fields = packageType.getFields();

    assume(fields).hasOwn('name');
    assume(fields.name.type).instanceOf(GraphQLNonNull);
    assume(fields.name.type.ofType.name).equals('String');

    assume(fields).hasOwn('description');
    assume(fields.description.type.name).equals('String');

    assume(fields).hasOwn('version');
    assume(fields.version.type.name).equals('String');

    assume(fields).hasOwn('dev');
    assume(fields.dev.type).instanceOf(GraphQLObjectType);
    assume(fields.dev.type.name).equals('Env');

    assume(fields).hasOwn('test');
    assume(fields.test.type).instanceOf(GraphQLObjectType);
    assume(fields.test.type.name).equals('Env');

    assume(fields).hasOwn('prod');
    assume(fields.prod.type).instanceOf(GraphQLObjectType);
    assume(fields.prod.type.name).equals('Env');
  });

  it('Build', function () {
    const buildType = schema.getType('Build');
    const fields = buildType.getFields();

    assume(fields).hasOwn('env');
    assume(fields.env.type).instanceOf(GraphQLEnumType);

    assume(fields).hasOwn('name');
    assume(fields.name.type).instanceOf(GraphQLNonNull);
    assume(fields.name.type.ofType.name).equals('String');

    assume(fields).hasOwn('buildId');
    assume(fields.buildId.type.name).equals('String');

    assume(fields).hasOwn('previousBuildId');
    assume(fields.previousBuildId.type.name).equals('String');

    assume(fields).hasOwn('createDate');
    assume(fields.createDate.type.name).equals('String');

    assume(fields).hasOwn('updateDate');
    assume(fields.updateDate.type.name).equals('String');

    assume(fields).hasOwn('version');
    assume(fields.version.type.name).equals('String');

    assume(fields).hasOwn('locale');
    assume(fields.locale.type.name).equals('String');

    assume(fields).hasOwn('cdnUrl');
    assume(fields.cdnUrl.type.name).equals('String');

    assume(fields).hasOwn('fingerprints');
    assume(fields.fingerprints.type).instanceOf(GraphQLList);
    assume(fields.fingerprints.type.ofType.name).equals('String');

    assume(fields).hasOwn('artifacts');
    assume(fields.artifacts.type).instanceOf(GraphQLList);
    assume(fields.artifacts.type.ofType.name).equals('String');

    assume(fields).hasOwn('recommended');
    assume(fields.recommended.type).instanceOf(GraphQLList);
    assume(fields.recommended.type.ofType.name).equals('String');

    assume(fields).hasOwn('files');
    assume(fields.files.type).instanceOf(GraphQLList);
    assume(fields.files.type.ofType.name).equals('String');

    assume(fields).hasOwn('status');
    assume(fields.status.type).instanceOf(GraphQLObjectType);
    assume(fields.status.type.name).equals('Status');
  });

  it('Env', function () {
    const envType = schema.getType('Env');
    const fields = envType.getFields();

    assume(fields).hasOwn('env');
    assume(fields.env.type).instanceOf(GraphQLEnumType);

    assume(fields).hasOwn('version');
    assume(fields.version.type.name).equals('String');

    assume(fields).hasOwn('status');
    assume(fields.status.type).instanceOf(GraphQLObjectType);
    assume(fields.status.type.name).equals('Status');
  });

  it('Status', function () {
    const statusType = schema.getType('Status');
    const fields = statusType.getFields();

    assume(fields).hasOwn('progress');
    assume(fields.progress.type).instanceOf(GraphQLObjectType);
    assume(fields.progress.type.name).equals('Progress');

    assume(fields).hasOwn('error');
    assume(fields.error.type.name).equals('Boolean');

    assume(fields).hasOwn('complete');
    assume(fields.complete.type.name).equals('Boolean');
  });

  it('Progress', function () {
    const progressType = schema.getType('Progress');
    const fields = progressType.getFields();

    assume(fields).hasOwn('percentage');
    assume(fields.percentage.type.name).equals('Float');

    assume(fields).hasOwn('count');
    assume(fields.count.type.name).equals('Int');

    assume(fields).hasOwn('total');
    assume(fields.total.type.name).equals('Int');
  });
});

describe('resolvers', function () {
  const args = {};
  const context = {
    wrhs: {
      builds: { get: sinon.stub() },
      status: {
        get: sinon.stub(),
        progress: sinon.stub(),
        events: sinon.stub()
      }
    },
    log: { error: sinon.stub() }
  };

  describe('Package - env fields', function () {
    const parent = {
      distTags: {
        dev: {}, test: {}, prod: {}
      },
      name: 'pkgName'
    };

    it('resolves null if the packages isn\'t distTagged in that env', function () {
      ['dev', 'test', 'prod'].forEach(function (env) {
        const field = schema.getType('Package').getFields()[env];
        const result = field.resolve({ distTags: {} });
        assume(result).equals(null);
      });
    });

    ['dev', 'test', 'prod'].forEach(function (env) {
      describe(env, function () {
        it('gets the build information from warehouse', async function () {
          context.wrhs.builds.get.yields(null, 'result');

          const field = schema.getType('Package').getFields()[env];
          const result = field.resolve(parent, args, context);

          assume(await result).equals('result');
          assume(context.wrhs.builds.get).is.calledWithMatch({ pkg: 'pkgName', env }, sinon.match.func);
        });

        it('rejects on error', async function () {
          const error = new Error('Bad thing');
          context.wrhs.builds.get.yields(error);

          const field = schema.getType('Package').getFields()[env];

          try {
            assume(await field.resolve(parent, args, context)).is.rejected();
          } catch (e) {
            assume(e).equals(error);
          } finally {
            assume(context.wrhs.builds.get).is.calledWithMatch({ pkg: 'pkgName', env }, sinon.match.func);
            assume(context.log.error).is.calledWith(`Unable to get build information for pkgName in ${env}`, error);
          }
        });

        it('resolves with null if the build isn\'t found', async function () {
          const error = new Error('404');
          context.wrhs.builds.get.yields(error);

          const field = schema.getType('Package').getFields()[env];

          assume(await field.resolve(parent, args, context)).equals(null);
          assume(await field.resolve(parent, args, context)).is.not.rejected();
          assume(context.wrhs.builds.get).is.calledWithMatch({ pkg: 'pkgName', env }, sinon.match.func);
          assume(context.log.error).is.calledWith(`Unable to get build information for pkgName in ${env}`, error);
        });
      });
    });
  });

  describe('Build', function () {
    describe('status', function () {
      it('gets the status information from warehouse', async function () {
        const status = schema.getType('Build').getFields().status;
        context.wrhs.status.get.yields(null, 'result');

        assume(await status.resolve({ name: 'pkgName', env: 'dev' }, args, context)).equals('result');
        assume(context.wrhs.status.get).is.calledWithMatch({ pkg: 'pkgName', env: 'dev' }, sinon.match.func);
      });

      it('rejects on error', async function () {
        const status = schema.getType('Build').getFields().status;
        const error = new Error('It all went wrong');
        context.wrhs.status.get.yields(error);

        try {
          assume(await status.resolve({ name: 'pkgName', env: 'dev' }, args, context)).is.rejected();
        } catch (e) {
          assume(e).equals(error);
        } finally {
          assume(context.wrhs.status.get).is.calledWithMatch({ pkg: 'pkgName', env: 'dev' }, sinon.match.func);
        }
      });
    });

    describe('updateDate', function () {
      it('renames the field', function () {
        const updateDate = schema.getType('Build').getFields().updateDate;

        assume(updateDate.resolve({ udpateDate: 'date' }, args, context)).equals('date');
      });
    });
  });

  describe('Env - status', function () {
    it('gets the status information from warehouse', async function () {
      const status = schema.getType('Env').getFields().status;
      context.wrhs.status.get.yields(null, 'result');

      assume(await status.resolve({ name: 'pkgName', env: 'dev' }, args, context)).equals('result');
      assume(context.wrhs.status.get).is.calledWithMatch({ pkg: 'pkgName', env: 'dev' }, sinon.match.func);
    });

    it('rejects on error', async function () {
      const status = schema.getType('Env').getFields().status;
      const error = new Error('It all went wrong');
      context.wrhs.status.get.yields(error);

      try {
        assume(await status.resolve({ name: 'pkgName', env: 'dev' }, args, context)).is.rejected();
      } catch (e) {
        assume(e).equals(error);
      } finally {
        assume(context.wrhs.status.get).is.calledWithMatch({ pkg: 'pkgName', env: 'dev' }, sinon.match.func);
      }
    });
  });

  describe('Status', function () {
    describe('events', function () {
      const parent = { pkg: 'pkgName', env: 'dev', version: '1.0.0' };

      it('gets the status events from warehouse', async function () {
        const events = schema.getType('Status').getFields().events;
        context.wrhs.status.events.yields(null, 'result');

        assume(await events.resolve(parent, args, context)).equals('result');
        assume(context.wrhs.status.events).is.calledWithMatch({ pkg: 'pkgName', env: 'dev', version: '1.0.0' }, sinon.match.func);
      });

      it('rejects on error', async function () {
        const events = schema.getType('Status').getFields().events;
        const error = new Error('It all went wrong');
        context.wrhs.status.events.yields(error);

        try {
          assume(await events.resolve(parent, args, context)).is.rejected();
        } catch (e) {
          assume(e).equals(error);
        } finally {
          assume(context.wrhs.status.events).is.calledWithMatch({
            pkg: 'pkgName',
            env: 'dev',
            version: '1.0.0'
          }, sinon.match.func);
        }
      });
    });

    describe('progress', function () {
      const parent = { pkg: 'pkgName', env: 'dev', version: '1.0.0' };

      it('gets the status information from warehouse', async function () {
        const progress = schema.getType('Status').getFields().progress;
        context.wrhs.status.progress.yields(null, 'result');

        assume(await progress.resolve(parent, args, context)).equals('result');
        assume(context.wrhs.status.progress).is.calledWithMatch({ pkg: 'pkgName', env: 'dev', version: '1.0.0' }, sinon.match.func);
      });

      it('rejects on error', async function () {
        const progress = schema.getType('Status').getFields().progress;
        const error = new Error('It all went wrong');
        context.wrhs.status.progress.yields(error);

        try {
          assume(await progress.resolve(parent, args, context)).is.rejected();
        } catch (e) {
          assume(e).equals(error);
        } finally {
          assume(context.wrhs.status.progress).is.calledWithMatch({
            pkg: 'pkgName',
            env: 'dev',
            version: '1.0.0'
          }, sinon.match.func);
        }
      });
    });
  });

  describe('Progress - percentage', function () {
    it('renames progress to percentage', function () {
      const percentage = schema.getType('Progress').getFields().percentage;
      assume(percentage.resolve({ progress: 30 })).equals(30);
    });
  });
});
