
// date picker adapted from https://formden.com/blog/date-picker
$(document).ready(() => {
  let date_input=$("input[name='date']");
  let date_container=$('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : 'body';
  date_input.datepicker({
    format: 'dd/mm/yyyy',
    container: date_container,
    todayHighlight: true,
    autoclose: true,
  })
  let d = new Date();
  $('#date').val(String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth()+1).padStart(2, '0') + '/' + d.getFullYear());
})