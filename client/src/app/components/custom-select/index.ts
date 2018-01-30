import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CustomSelectComponent } from './custom-select.component';
import { HighlightPipe } from './select-pipes';
import { OffClickDirective } from './off-click';

export { CustomSelectComponent };

@NgModule({
    imports: [ CommonModule, FormsModule ],
    declarations: [
        CustomSelectComponent, HighlightPipe, OffClickDirective
    ],
    exports: [ CustomSelectComponent, HighlightPipe, OffClickDirective ]
})
export class CustomSelectModule { }