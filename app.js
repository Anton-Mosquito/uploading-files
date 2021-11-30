import { upload } from './upload';
console.log('app.js');
upload('#file', {
  multi: true,
  accept: ['.png', '.jpg','.jpeg','.gif']
});