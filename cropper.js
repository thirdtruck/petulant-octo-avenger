$(document).ready(function() {
  var previewImageID = 'preview-image';

  var jcrop_api;
  var defaultCropBox = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0,
    w: 200,
    h: 200
  };

  var $uploadImage = $('#uploaded-image');
  var $previewImage = $('#'+previewImageID);
  var $previewImageLink = $('#preview-image-link');
  var $previewCropped = $('#preview-cropped');
  var $onlyAfterUpload = $('.only-after-upload');
  var $onlyAfterCrop = $('.only-after-crop');

  function updatePreview(imageSource, cropBox) {
    var ctx = $previewCropped.get(0).getContext('2d');

    var tempImage = new Image();
    tempImage.src = imageSource;

    $previewCropped.attr('width', cropBox.w);
    $previewCropped.attr('height', cropBox.h);

    ctx.drawImage(tempImage, cropBox.x, cropBox.y, cropBox.w, cropBox.h, 0, 0, cropBox.w, cropBox.h);
  }

  function displayLoadedImage(el) {
    imageSource = el.target.result;

    $onlyAfterUpload.show();
    $onlyAfterCrop.hide();

    $oldImage = $previewImage;
    $previewImage = $('<img id="'+previewImageID+'" />')
    if(jcrop_api) {
      jcrop_api.destroy();
    }
    $previewImage.replaceAll($oldImage);

    $previewImage.attr('src', imageSource);

    $previewImageLink.attr('href', imageSource);
    $previewImageLink.text('Download cropped image');

    $previewImage.Jcrop(
      {
        aspectRatio: 1,
        setSelect: [defaultCropBox.x, defaultCropBox.y, defaultCropBox.w, defaultCropBox.h],
        onSelect: function(cropBox) {
          $onlyAfterCrop.show();
          updatePreview(imageSource, cropBox);
        }

      },
      function() { jcrop_api = this; }
    );
    updatePreview(imageSource, defaultCropBox);
  }

  var iFrameIdentifier = 'upload-iframe';

  function buildUploadiFrame() {
    var $iframe = $('<iframe />');
    $iframe.attr('id', iFrameIdentifier);
    $iframe.attr('name', iFrameIdentifier);
    $iframe.css('display', 'none');
    var antilock = function() {
      var running = false;
    }
    $iframe.on('error', antilock);
    $iframe.ready(antilock);

    return $iframe;
  }

  function buildUploadForm() {
    var $form = $('<form />');
    $form.attr('method', 'POST');
    $form.attr('action', '/upload_image');
    $form.attr('target', iFrameIdentifier);
    $form.attr('encoding', 'multipart/form-data');
    $form.attr('enctype', 'multipart/form-data');

    return $form;
  }

  $uploadImage.on('change', function() {
    if(typeof FileReader !== "undefined") {
      var file = this.files[0];
      var reader = new FileReader();
      $(reader).on('load', displayLoadedImage);
      reader.readAsDataURL(file);
    } else {
      var $iframe = buildUploadiFrame();
      $('body').append($iframe);

      var $form = buildUploadForm();
      $('body').append($form);

      $form.submit();
    }
  });
});
