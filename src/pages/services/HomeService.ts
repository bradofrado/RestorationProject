import { api } from "~/utils/api";

export class HomeService {
	getName(): string {
		return api.home.name.useQuery().data as string;
	}
}