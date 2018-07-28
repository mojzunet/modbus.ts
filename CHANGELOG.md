# CHANGELOG

## 3.0.0 (?)

### Features

- Make `serialport` dependency optional by making port constructor argument to `rtu.Master` more generic (contributed by Wolf Walter).
- Reimplement master abstract class queue using observables, requests send in order made and sent after previous requests have completed.
- Add `destroy` method to `rtu.Master` and `tcp.Client` classes, cleans up observables and disconnected port/socket if connected.

### Changes

- Refactoring for file/class name consistency with other libraries.
- Update documentation link in `README.md`.