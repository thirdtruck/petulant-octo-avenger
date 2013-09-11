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

  var $uploadForm = $('#upload-form');

  var $uploadImage = $('#uploaded-image');
  var $previewImage = $('#'+previewImageID);
  var $previewImageLink = $('#preview-image-link');
  var $previewCropped = $('#preview-cropped');
  var $onlyAfterUpload = $('.only-after-upload');
  var $onlyAfterCrop = $('.only-after-crop');

  var iFrameIdentifier = 'upload-iframe';

  var $uploadiFrame;

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
    $form.attr('id', 'iframe-upload');
    $form.attr('method', 'POST');
    $form.attr('action', '/upload_memory');
    $form.attr('target', iFrameIdentifier);
    $form.attr('encoding', 'multipart/form-data');
    $form.attr('enctype', 'multipart/form-data');

    var $clone = $uploadImage.clone();
    var $submit = $('<input type="submit" />');
    $submit.hide();
    $form.append($clone);
    $form.append($submit);

    //$form.ajaxForm({
    $('form').ajaxForm({
      uploadProgress: function(event, position, total, percentComplete) {
        console.log(arguments);
      },
      success: function() {
        console.log("Successful upload!");
        $.get('/uploaded_memory_jpg', function(imageTag) {
          console.log($previewImage, $previewImage.length, imageTag);
          $previewImage.replaceWith(imageTag);
        });
      },
      complete: function(xhr) {
        console.log("Completed ajax upload: ", xhr.responseText);
        $.get('/uploaded_memory_jpg', function(imageTag) {
          console.log($previewImage, $previewImage.length, imageTag);
          $previewImage.replaceWith(imageTag);
        });
      }
    });

    $clone.on('change', function() {
      console.log("Submitting form");
      $form.submit(function() {
        $uploadiFrame.ready(function() {
          console.log('iFrame loaded 2');
        });
      });
      $uploadiFrame.ready(function() {
        console.log('iFrame loaded');
      });
    });

    return $form;
  }

  function newUpload() {
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

    $uploadImage.on('change', function() {
      var file = this.files[0];
      var reader = new FileReader();
      $(reader).on('load', displayLoadedImage);
      reader.readAsDataURL(file);
    });
  }

  function oldUpload() {
    $uploadiFrame = buildUploadiFrame();
    $('body').append($uploadiFrame);

    var $form = buildUploadForm();
    $uploadForm.replaceWith($form);
  }

  if(typeof FileReader !== "undefined") {
    newUpload();
  } else {
    oldUpload();
  }
});
