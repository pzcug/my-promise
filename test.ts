import adapter from './adapter'
import promisesAplusTests from 'promises-aplus-tests'

promisesAplusTests(adapter, function (err: any) {
    if (err) {
        console.error(err);
    } else {
        console.log('All tests passed');
    }
});
