import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ItemName } from '../../api/itemName';
import { ObjectList } from '../../api/objectList';
import { Tool } from '../../api/tool';
import { ToolCreation } from '../../data/model/toolCreation.model';

@Injectable({
    providedIn: 'root'
})
export class ToolService {

    private toolsUrl = `${environment.apiUrl}/tools`;
    private activeToolNamesUrl = `${environment.apiUrl}/activeToolNames`;

    constructor(private http: HttpClient) { }

    getActiveToolNames(): Observable<ItemName[]> {
        return this.http.get<ItemName[]>(this.activeToolNamesUrl);
    }

    getTools(currentPage: number, pageSize: number): Observable<ObjectList> {
        let url = this.toolsUrl + "?pageNo=" + currentPage + "&pageSize=" + pageSize;
        return this.http.get<ObjectList>(url);
    }

    createTool(tool: ToolCreation): Observable<Tool> {
        return this.http.post<Tool>(this.toolsUrl, tool, environment.httpOptions);
    }

    deleteTool(toolId: number) {
        let url = this.toolsUrl + "/" + toolId;
        return this.http.delete(url);
    }

}
