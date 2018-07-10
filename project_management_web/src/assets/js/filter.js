/**
 * Created by Jerry on 2018/7/9.
 */
import Vue from 'vue';
import moment from 'moment';
Vue.filter("dateFormat", function(value,format) {
  return moment(value).format(format);
});
