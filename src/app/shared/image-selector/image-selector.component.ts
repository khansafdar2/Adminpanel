import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent implements OnInit {

  constructor(
    private sharedService: SharedService
  ) {
  }

  @Input()
  public set files(val: string|[]) {
    if(val) {
      if(typeof val === "string") {
        this.addMedia([val])
      } else {
        this.addMedia(val);
      }
    }
  }

  @Input() multiple: boolean = false;
  @Input() formats: string = ".jpg,.jpeg,.png";
  @Input() maxSize: string = "5";
  @Input() theme: string = "dragNDrop";
  @Input() sortable: boolean = false;
  @Input() valueType: string = "object";

  @Output() filesChange = new EventEmitter<string|any|string[]|any[]>();

  medias = [];

  afuConfig = null;

  addMedia(newMedias) {
    let medias = newMedias.map(media => {
      if(typeof media === "string") {
        let mediaObj = {
          cdn_link: media,
          type: ""
        }
        let nameArray = media.split(".");
        let extension = nameArray[nameArray.length - 1];
        if(extension === "mp4") {
          mediaObj.type = "video";
        } else {
          mediaObj.type = "image";
        }
        return mediaObj;
      } else {
        let nameArray = media.file_name.split(".");
        let extension = nameArray[nameArray.length - 1];
        if(extension === "mp4") {
          media.type = "video";
        } else {
          media.type = "image";
        }
        return media;
      }
    });

    if(this.multiple) {
      this.medias = this.medias.concat(medias);
    } else {
      this.medias = medias;
    }
  }

  emitFilesChange() {
    if(this.multiple) {
      if(this.valueType === "object") {
        this.filesChange.emit(this.medias);
      } else {
        let links = this.medias.map(media => media.cdn_link);
        this.filesChange.emit(links);
      }
    } else {
      if(this.valueType === "object") {
        this.filesChange.emit(this.medias[0] ? this.medias[0] : []);
      } else {
        let link = this.medias[0] ? this.medias[0].cdn_link : "";
        this.filesChange.emit(link);
      }
    }
  }

  mediaUploaded(response) {
    if(response.status === 200) {
      this.addMedia(response.body);
      this.emitFilesChange();
    }
  }

  mediaSortChanged(event) {

  }

  removeMedia(index) {
    this.medias.splice(index, 1);
    this.emitFilesChange();
  }

  ngOnInit(): void {
    this.afuConfig = {
      uploadAPI: this.sharedService.afuUploadAPI,
      theme: this.theme,
      multiple: this.multiple,
      formatsAllowed: this.formats,
      maxSize: this.maxSize,
      hideResetBtn: true,
      autoUpload: true,
      replaceTexts: {
        selectFileBtn: "Select image",
        dragNDropBox: "Drop image here.",
        uploadBtn: "Upload and save",
        sizeLimit: "Size Limit"
      }
    };
  }

}
