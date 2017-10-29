class Graph {
    constructor(size) {
        this.matrix = [];

        for(let i = 0;i<size;i++){
            this.matrix.push([]);
            for(let j = 0;j<size;j++){
                this.matrix[i].push(0);
            }
        }
    }

    size(){
        return this.matrix.length;
    }

    addEgde(a,b){
        this.matrix[a-1][b-1] = 1;
    }

    isEdge(a,b){
        return this.matrix[a-1][b-1] > 0;
    }

    clone(){
        var G = new Graph(this.size());

        for(var i = 1;i<=this.size();i++){
            for(var j = 1;j<=this.size();j++){
                if(this.isEdge(i, j)){
                    G.addEgde(i,j);
                }
            }
        }
        return G;
    }

    transitiveClosing(){
        var G = this.clone();
        var n = G.size();

        for(var i=0;i<n;i++){
            for(var x=0;x<n;x++){
                for(var y=0;y<n;y++){
                    G.matrix[x][y] = G.matrix[x][y] + (G.matrix[x][i] * G.matrix[i][y]);
                }
            }
        }

        return G;
    }

    searchCFC(){
        let G = this.transitiveClosing();
        let n = G.size();
        let NE = [];
        for(var i=0;i<this.size();i++){
            NE.push(i+1);
        }
        let cfcs = [];

        for(var i=1;i<=n;i++){

            var index = NE.indexOf(i);

            if(index > -1){
                var cfc = [];
                cfc.push(i);
                NE.splice(index, 1);

                if(G.isEdge(i,i)){
                    for(var j=i+1;j<=n+1;j++){
                        if(G.isEdge(i,j) && G.isEdge(j,i)){
                            cfc.push(j);
                            index = NE.indexOf(j);
                            NE.splice(index,1);
                        }
                    }
                }

                cfcs.push(cfc);
            }
        }

        return cfcs;
    }

    prepareNodesDataSet() {
        var nodes = [];
        for(var i=0;i<this.size();i++){
            nodes.push({id:i+1, label:(i+1).toString()});
        }

        return nodes;
    }

    prepareEdgesDataSet() {
        var edges = [];
        for(var i=0;i<this.size();i++){
            for(var j=0;j<this.size();j++){
                if(this.isEdge(i+1, j+1)){
                    edges.push({from: i+1, to: j+1, arrows:"to"})
                }
            }
        }

        return edges;
    }

    asHTMLTable(){
        var ret = "<table><thead><tr><th></th>";

        for(var i=0;i<this.size();i++){
            ret = ret + "<th>"+(i+1)+"</th>";
        }

        ret = ret + "</tr></thead><tbody>";

        for(var i=0;i<this.size();i++){
            ret = ret + "<tr><th>"+(i+1)+"</th>";

            for(var j=0;j<this.size();j++){
                ret = ret + "<td>"+(this.matrix[i][j] > 0 ? "<strong>1</strong>" : "0")+"</td>";
            }
            ret = ret + "<tr>";
        }

        ret = ret + "</tbody></table>";

        return ret;
    }

}
