# tinkerhub-daemon

Run and manage [Tinkerhub](https://github.com/tinkerhub/tinkerhub) plugins on
your local machine, such as Raspberry Pi.

To use, first [install NodeJS](https://nodejs.org/en/download/package-manager/),
then install via `npm`:

```
$ npm install -g tinkerhubd
$ npm install -g tinkerhub-cli
```

This will install two commands, `tinkerhubd` for managing the daemon and
`tinkerhub` for interacting with things on your network.

## Starting and stopping

The command `start` will start the daemon in the background as the current
user:

```
$ tinkerhubd start
```

Use `stop` to stop the daemon:

```
$ tinkerhubd stop
```

## Managing plugins

Plugins are installed via `install`:

```
$ tinkerhubd install <plugin-name>
$ tinkerhubd install device-hue
$ tinkerhubd install bridge-zwave
```
