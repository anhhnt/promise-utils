'use strict';
function promiseForSeconds(numberOfSecond, name) {
	return new Promise(function(resolve, reject) {
		setTimeout(function () {
			console.log('End task ' + name);
			resolve();
		}, numberOfSecond * 1000);
	});
}

function doLooping(count, executors) {
	let round = 0;
	let a = [],b = [];
	let mainExecutor = function () {
		for (let i = 0; i < executors.length; i++) {
			a[round] = Promise.resolve(null);
			b[round] = a[round].then(function () {
				return executors[i].call(this, round, function () {
					if (round++ < count) {
						mainExecutor();
					}
				});
			});
			a[round] = b[round];
		}
	};
	mainExecutor();
};

let taskA = function (round, mainExecutor) {
	console.log('Start task A round ' + round);
	return promiseForSeconds(2, 'task A round ' + round);
};
let taskB = function (round, mainExecutor) {
	if(typeof mainExecutor === 'function') {
		mainExecutor();
	}
	console.log('Start task B round ' + round);
	return promiseForSeconds(2, 'task B round ' + round);
};
let taskC = function (round, mainExecutor) {
	console.log('Start task C round ' + round);
	return promiseForSeconds(2, 'task C round ' + round);
};
//This loop the set of tasks [A, B, C] for  times, task A of round 2 must wait until task A of round 1 finished
doLooping(3, [taskA, taskB, taskC]);

