$(document).ready(function() {
  var $uploadImage = $('#uploaded-image');
  var $previewImage = $('#preview-image');

  function displayLoadedImage(el) {
    imageSource = el.target.result;
    $previewImage.attr('src', imageSource);
  }

  $uploadImage.on('change', function() {
    var file = this.files[0];
    var reader = new FileReader();
    $(reader).on('load', displayLoadedImage);
    reader.readAsDataURL(file);
  });
});
