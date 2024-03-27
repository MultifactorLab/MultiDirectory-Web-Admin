import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { Observable, Subject, lastValueFrom, of } from "rxjs";
import { Treenode } from "./model/treenode";
import { TreeSearchHelper } from "./core/tree-search-helper";
import { ExpandStrategy } from "./model/expand-strategy";

@Component({
    selector: 'md-treeview',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeviewComponent implements OnInit {
    @Input() tree: Treenode[] = [];
    @Input() expandStrategy = ExpandStrategy.AlwaysUpdate;
    @Input() nodeLabel: TemplateRef<any> | null = null;
    @Input() checkboxes = false;
    @ViewChild('defaultLabel', { static: true }) defaultLabel!: TemplateRef<any>;
    @Output() onNodeSelect = new EventEmitter<Treenode>();
    private _selectedNode: Treenode | null = null;
    private _focusedNode: Treenode | null = null;

    constructor(private cdr: ChangeDetectorRef) {}
    ngOnInit(): void {
        if(!this.nodeLabel) {
            this.nodeLabel = this.defaultLabel;
        }
    }

    private loadChildren(node: Treenode): Observable<Treenode[]> {
        if(!!node.loadChildren && this.expandStrategy == ExpandStrategy.AlwaysUpdate)
        {
            return node.loadChildren ? node.loadChildren() : of([]);
        }
        return of(node.children);
    }

    private setNodeExpanded(node: Treenode, state: boolean = true): Observable<Treenode[]> {
        node.expanded = state;
        if(node.expanded) {
            return this.loadChildren(node);
        }
        return of(node.children ?? []);
    }

    private setNodeSelected(node: Treenode) {
        this.setNodeFocused(undefined);
        if(node.selectable) {
            TreeSearchHelper.traverseTree(this.tree, (node , path)=> { node.selected = false; });
            node.selected = true;
            this._selectedNode = node;
            this.onNodeSelect.emit(node);
            this.cdr.detectChanges();
        }
    }

    private setNodeFocused(node?: Treenode) {
        TreeSearchHelper.traverseTree(this.tree, (node, path) => {node.focused = false}, []);
        this._focusedNode = null;
        if(node) {
            node.focused = true;
            this._focusedNode = node;
        }
    }

    addRoot(node: Treenode) {
        this.tree.push(node);
        this.cdr.detectChanges();
    }

    expand(node: Treenode) {
        if(!node.selected && node.selectable && node.expanded) {
            this.setNodeSelected(node);
            return;
        }
        this.setNodeExpanded(node, !node.expanded).subscribe(x => {
            node.children = x;
            if(node.selectable) {
                this.setNodeSelected(node);
            }
            this.cdr.detectChanges();
        });
    }

    select(toSelect?: Treenode) {
        let nodePath: Treenode[] = [];

        if(!toSelect) {
            // Clear the selection
            TreeSearchHelper.traverseTree(this.tree, (n, path) => {
                n.selected = false; 
            });
            this.cdr.detectChanges();
            return;
        }
        
        if(toSelect.selected) {
            this.loadChildren(toSelect).subscribe(x => {
                toSelect!.children = x;
                this.cdr.detectChanges();
            })
            return;
        }

        // Search a tree for a toSelect rote path 
        TreeSearchHelper.traverseTree(this.tree, (n, path) => {
            n.selected = false; 
            if(n.id == toSelect!.id) {
                nodePath = [...path];
                toSelect = n;
            }
        });

        // Expand Every Node on the route path
        nodePath.forEach(x => {
            x.expanded = true;
            x.selected = false;
        });

        toSelect!.selected = true;
        toSelect!.expanded = true;
        this.loadChildren(toSelect).subscribe(x => {
            toSelect!.children = x;
            this.cdr.detectChanges();
        })
    }

    @HostListener('keydown', ['$event']) 
    handleKeyEvent(event: KeyboardEvent) {
        if(!this._focusedNode) {
            this._focusedNode =  this._selectedNode ?? this.tree[0];
        }
        if(event.key == 'ArrowUp') {
            // parent 
            let nextNode = TreeSearchHelper.findPrevious(this.tree, this._focusedNode);
            this.setNodeFocused(nextNode);
        }
        if(event.key == 'ArrowDown') {
            const sibling = TreeSearchHelper.findNext(this.tree, this._focusedNode);
            if(sibling) {
                this.setNodeFocused(sibling);
            }
        } 
        if(event.key == 'ArrowRight' || event.key == 'Enter') {
            // expand + child 
            let nextNode = this._focusedNode ?? null;
            if(nextNode) {
                this.expand(nextNode);
            }
        }
        if(event.key == 'ArrowLeft') {
            // parent + collapse
            let nextNode = this._focusedNode;
            if(nextNode?.parent && nextNode?.parent?.id !== 'root') {
                nextNode.expanded = false;
                this.cdr.detectChanges();
            }
        }
    }

    handleNodeClick(event: Event, node: Treenode) {
        event.stopPropagation();
        this.expand(node);
    }

    handleRightClick(event: Event, node: Treenode) {
        event.stopPropagation();
        alert('clck' + node.id);
    }

    redraw() {
       this.cdr.detectChanges();
    }
}
