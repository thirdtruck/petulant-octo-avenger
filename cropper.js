$(document).ready(function() {
  var $uploadImage = $('#uploaded-image');
  var $previewImage = $('#preview-image');
  var $previewImageLink = $('#preview-image-link');
  var $previewCropped = $('#preview-cropped');

  function updatePreview(imageSource, cropBox) {
    console.log(cropBox);

    var ctx = $previewCropped.get(0).getContext('2d');

    var tempImage = new Image();
    tempImage.src = imageSource;

    $previewCropped.attr('width', cropBox.w);
    $previewCropped.attr('height', cropBox.h);

    ctx.drawImage(tempImage, cropBox.x, cropBox.y, cropBox.w, cropBox.h, 0, 0, cropBox.w, cropBox.h);
  }

  function displayLoadedImage(el) {
    imageSource = el.target.result;

    $previewImage.attr('src', imageSource);
    $previewImageLink.attr('href', imageSource);
    $previewImageLink.text('Download cropped image');
    $previewImage.Jcrop({
      onSelect: function(cropBox) { updatePreview(imageSource, cropBox); }
    });
  }

  $uploadImage.on('change', function() {
    var file = this.files[0];
    var reader = new FileReader();
    $(reader).on('load', displayLoadedImage);
    reader.readAsDataURL(file);
  });
});
