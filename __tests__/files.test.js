const JSON5 = require('json5');
const fs = require('fs');
const pify = require('pify');
const crossSpawn = require('cross-spawn');
const rimraf = require('rimraf');

describe('file locator', function () {
  beforeAll(async () => {
    await pify(rimraf)('./filetests');
  });

  describe('babel-preset-env', function () {
    const dir = './filetests/babel-preset-env';

    beforeAll(async () => {
      const gitArgs = ['clone', 'https://github.com/babel/babel-preset-env', '--branch', '1.x', '--single-branch', dir];

      // pify only works with callback style
      // crossSpawn which uses child_process.spawn has no callback style
      await new Promise((resolve, reject) => {
        const child = crossSpawn('git', gitArgs, { stdio: 'inherit' });
        child.on('error', (err) => reject(err));
        child.on('close', () => resolve());
      });

      await new Promise((resolve, reject) => {
        const child = crossSpawn('node', ['../../bin/babel-upgrade'], { stdio: 'inherit', cwd: dir });
        child.on('error', (err) => reject(err, err.stack));
        child.on('close', () => resolve());
      });
    }, 10000);

    it('package.json', async function () {
      const rawPackage = (await pify(fs.readFile)(`${dir}/package.json`)).toString('utf8');
      const packageJson = JSON5.parse(rawPackage);

      expect(packageJson).toMatchSnapshot();
    });
  });

  describe('screeps-flowtype-jest-skeleton', function () {
    const dir = './filetests/screeps-flowtype-jest-skeleton';

    beforeAll(async () => {
      const gitArgs = ['clone', 'https://github.com/FossiFoo/screeps-flowtype-jest-skeleton', '--single-branch', dir];

      // pify only works with callback style
      // crossSpawn which uses child_process.spawn has no callback style
      await new Promise((resolve, reject) => {
        const child = crossSpawn('git', gitArgs, { stdio: 'inherit' });
        child.on('error', (err) => reject(err));
        child.on('close', () => resolve());
      });

      await new Promise((resolve, reject) => {
        const child = crossSpawn('node', ['../../bin/babel-upgrade'], { stdio: 'inherit', cwd: dir });
        child.on('error', (err) => reject(err, err.stack));
        child.on('close', () => resolve());
      });
    }, 10000);

    it('package.json', async function () {
      const rawPackage = (await pify(fs.readFile)(`${dir}/package.json`)).toString('utf8');
      const packageJson = JSON5.parse(rawPackage);

      expect(packageJson).toMatchSnapshot();
    });

    it('.babelrc', async function () {
      const rawBabelRC = (await pify(fs.readFile)(`${dir}/.babelrc`)).toString('utf8');
      const babelRC = JSON5.parse(rawBabelRC);

      expect(babelRC).toMatchSnapshot();
    });
  });

});
