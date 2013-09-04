$(document).ready(function() {
  var $uploadImage = $('#uploaded-image');
  var $previewImage = $('#preview-image');

  function cropByHalf(imageSource) {
    var tempImage = new Image();
    tempImage.src = imageSource;

    var canvasWidth = 200;
    var canvasHeight = 200;
    var $canvas = $('<canvas width="'+ canvasWidth +'" height="'+ canvasHeight +'"/>');

    var ctx = $canvas.get(0).getContext('2d');
    ctx.drawImage(tempImage, 0, 0);
    var croppedSource = $canvas.get(0).toDataURL();

    return croppedSource;
  }

  function displayLoadedImage(el) {
    imageSource = el.target.result;
    croppedSource = cropByHalf(imageSource);
    $previewImage.attr('src', croppedSource);
  }

  $uploadImage.on('change', function() {
    var file = this.files[0];
    var reader = new FileReader();
    $(reader).on('load', displayLoadedImage);
    reader.readAsDataURL(file);
  });
});
