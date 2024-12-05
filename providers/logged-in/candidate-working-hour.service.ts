import { CandidateWorkingHour } from "@/models/candidate";
import axios from "../AxiosService";


const _workingHourEndpoint = '/candidate-working-hours';

/**
   * Return working dates
   * @returns {Observable<any>}
   */
export async function listWorkingDates(page: number, params = '&expand=company,dateListByCandidate'): Promise<any> {
  const url = _workingHourEndpoint + '/date?page=' + page + params;
  const response = await axios.get(url);
  return response.data;
}

/**
 * add session manually 
 * @param model 
 * @returns 
 */
export async function addWorkingHour(model: CandidateWorkingHour): Promise<any> {
  const url = _workingHourEndpoint;
  const response = await axios.post(url, model);
  return response.data;
}

/**
 * return detail
 * @param date
 */
export async function workingDateDetail(date: string): Promise<any> {
  const url = `${_workingHourEndpoint}/date/${date}?expand=company,dateListByCandidate`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Return working date stats
 * @param date 
 * @returns 
 */
export async function workingDateStats(date: string): Promise<any> {
  const url = `${_workingHourEndpoint}/stats?${date}`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Return working hours
 * @returns {Observable<any>}
 */
export async function listHours(page: number, param: string = ""): Promise<any> {
  const url = _workingHourEndpoint + `/hour?page=${page}&expand=store,store.company${param}`;
  const response = await axios.get(url);
  return response;
}
