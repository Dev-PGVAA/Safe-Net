import { Controller, Get } from '@nestjs/common'
import { StagesService } from '../services/stages.service'
@Controller('learning/stages')
export class StagesController {
	constructor(private readonly stagesService: StagesService) {}
	@Get()
	async getStages() {
		return this.stagesService.getStagesWithStats()
	}
}
