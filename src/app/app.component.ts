import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Editor from 'ckeditor5/build/ckeditor';

export class UploadAdapter {
  private loader;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file
      .then((file: any) => new Promise((resolve, reject) => {
        var myReader = new FileReader();
        myReader.onloadend = (e) => {
          resolve({ default: myReader.result });
        }
        myReader.readAsDataURL(file);
      }));
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ckeditor-example';
  public Editor: any = Editor;

  @ViewChild('customEditor') customEditor!: ElementRef;

  isDisabled = false;
  editData: any;

  config = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'link',
      'superscript',
      'subscript',
      'strikethrough',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'imageUpload',
      'imageInsert',
      'blockQuote',
      'mediaEmbed',
      'insertTable',
      '|',
      'fontFamily',
      'fontBackgroundColor',
      'fontSize',
      'fontColor',
      '|',
      'alignment',
      'code',
      'selectAll',
      'sourceEditing',
    ],
    typing: {
      transformations: {
        remove: [
          'symbols',
          'quotes',
          'arrowLeft',
          'arrowRight'
        ],
        extra: [
          { from: ':)', to: '🙂' },
          { from: ':+1:', to: '👍' },
          { from: ':tada:', to: '🎉' },
          { from: '<3', to: '❤️' },
        ],
      }
    },
  }

  editorData: string = 'abc';

  ngAfterViewInit(): void {
    this.editData = this.customEditor;
  }

  ngOnInit(): void {
    this.loadContent();
  }


  onReady(eventData: any) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader: any) {
      console.log('loader : ', loader)
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }

  saveToLocalStorage() {
    const editorContent = this.editData.editorInstance.getData();
    localStorage.setItem('customEditorContent', editorContent);
  }

  loadContent() {
    const savedContent = localStorage.getItem('customEditorContent');
    if (savedContent) {
      setTimeout(() => {
        this.editData?.editorInstance.setData(savedContent);
      }, 10)
    }
  }
}
