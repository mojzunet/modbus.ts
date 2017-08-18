/* tslint:disable:interface-name no-shadowed-variable */
import * as Debug from "debug";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { TimeoutError } from "rxjs/util/TimeoutError";
export { Observable, Subject, BehaviorSubject, TimeoutError };
import "rxjs/add/observable/bindCallback";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/do";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/take";
import "rxjs/add/operator/takeUntil";
import "rxjs/add/operator/timeout";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/retryWhen";
import "rxjs/add/operator/scan";
import "rxjs/add/operator/skip";

/** Debug operator. */
Observable.prototype.debug = function(debug: Debug.IDebugger, name: string, ...args: any[]) {
  return this.do({
    next: (next) => {
      debug(`next:${name}`, next, ...args);
    },
    error: (error) => {
      debug(`error:${name}`, error, ...args);
    },
    complete: () => {
      debug(`complete:${name}`, ...args);
    },
  });
};

declare module "rxjs/Observable" {
  interface Observable<T> {
    debug: (debug: Debug.IDebugger, name: string, ...args: any[]) => Observable<T>;
  }
}