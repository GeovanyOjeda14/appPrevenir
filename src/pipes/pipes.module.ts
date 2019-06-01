import { NgModule } from '@angular/core';
import { YoutubePipe } from './youtube/youtube';
import { FilterPipe } from './filter/filter';
@NgModule({
	declarations: [YoutubePipe,
    FilterPipe],
	imports: [],
	exports: [YoutubePipe,
    FilterPipe]
})
export class PipesModule {}
