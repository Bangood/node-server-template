/**
 * Created by pure on 2017/8/29.
 */
import app from './config/express';
app.listen(3001, ()=>{
  console.log(`server started on port ${3001} (${'development'})`);
});