#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const exec = require('child_process').exec
const execSync = require('child_process').execSync
const chalk = require('chalk')
const commandExists = require('command-exists')

const localPath = path.resolve()
const packageJSONPath = path.resolve('package.json')
const actionPath = path.resolve('src/actions')
const reducersPath = path.resolve('src/reducers')
const containerPath = path.resolve('src/container')
const componentsPath = path.resolve('src/components')

const packageJSON = require(packageJSONPath)

let packageIsAlready = false,
    folderIsAlready = false

function clear() {
  process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H')
}

function isExistsPackage(name) {
  return packageJSON.dependencies[name]
}

function isExistsPath(path) {
  return fs.existsSync(path)
}

function createFolder(path, callback) {
  return fs.mkdir(path, callback)
}

function isCommandExists(name) {
  return commandExists(name)
}

function copyFile() {
  return new Promise(resolve => {
    if (
      !isExistsPath(reducersPath) &&
      !isExistsPath(actionPath)
    ) {
      console.log()
      console.log()
      console.log(chalk.yellow('  run create src/reducers and src/actions template'))
      console.log()
      try {
        fs.copySync(__dirname + '/template/reducers', localPath + '/src/reducers');
        console.log(chalk.green('  1. create reducers folder done checkout \'src/reducers\''))
        fs.copySync(__dirname + '/template/actions', localPath + '/src/actions');
        console.log(chalk.green('  2. create action folder done checkout \'src/actions\''))
        fs.copySync(__dirname + '/template/container', localPath + '/src/container');
        console.log(chalk.green('  3. create action folder done checkout \'src/container\''))
        fs.copySync(__dirname + '/template/components', localPath + '/src/components');
        console.log(chalk.green('  4. create action folder done checkout \'src/components\''))
        fs.copySync(__dirname + '/template/index.js', localPath + '/src/index.js');
        console.log(chalk.green('  5. create action folder done checkout \'src/index.js\''))
        fs.copySync(__dirname + '/template/App.js', localPath + '/src/App.js');
        console.log(chalk.green('  6. create action folder done checkout \'src/App.js\''))

        resolve(true)
      } catch(err) {
        throw new Error(err)
      }
    } else {
      console.log(chalk.red('  You already have src/reducers or src/actions in your project.'))
      folderIsAlready = true

      if (packageIsAlready && folderIsAlready) {
        console.log()
        console.log()
        console.log(chalk.green('  use \'npm start\' to run create-react-app server now !!!!!'))
      }
    }
  })
}

run()

function run() {

  clear()

  const hasReduxPakcage = isExistsPackage('redux')
  const hasReactReduxPackage = isExistsPackage('react-redux')

  if (
    !hasReduxPakcage ||
    !hasReactReduxPackage
  ) {
    if (!hasReduxPakcage) {
      console.log()
      isCommandExists('yarn')
        .then(() => {
          console.log(chalk.yellow('  run install redux'))
          try {
            execSync('yarn add redux')
            console.log(chalk.green('  install redux done'))
          } catch(err) {
            throw new Error(err)
          }
          return true
        })
        .then((success) => {
          console.log()
          if (success) {
            if (!hasReactReduxPackage) {
              console.log(chalk.yellow('  run install react redux'))
              try {
                execSync('yarn add react-redux')
                console.log(chalk.green('  install react-redux done'))
              } catch(err) {
                throw new Error(err)
              }
            }
          }
        })
        .then((success) => {
          let copy = copyFile()
          copy.then(done => {
            if (done) {
              console.log()
              console.log()
              console.log(chalk.green('  redux install done, checkout your src/reducers and src/actions'))
              console.log()
              console.log()
              console.log(chalk.green('  use \'npm start\' to run create-react-app server now !!!!!'))
            }
          })
        })
        .catch(() => {
          console.log('  run with npm')
          if (!hasReactReduxPackage) {
            console.log()
            console.log(chalk.yellow('  run install react redux'))
            try {
              execSync('  npm install redux')
            } catch(err) {
              throw new Error(err)
            }
            console.log()
            console.log(chalk.yellow('  run install react redux'))
            try {
              execSync('  npm install react-redux')
            } catch(err) {
              throw new Error(err)
            }

            copyFile()
          }
        })
    }
  } else {
    console.log()
    console.log(chalk.green('  package already installed'))
    packageIsAlready = true
    let copy = copyFile()
    copy.then(done => {
      if (done) {
        console.log()
        console.log(chalk.green('  redux install done, checkout your \'src/reducers\' and \'src/actions\''))
        console.log()
        console.log()
        console.log(chalk.green('  use \'npm start\' to run create-react-app server now !!!!!'))
      }
    })
  }
}
