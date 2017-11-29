class Graph {

    /**
    * Constructeur de la classe Graph
    * @param size : Taille du nouveau graphe
    */
    constructor(size) {
        this.matrix = [];

        for(let i = 0;i<size;i++){
            this.matrix.push([]);
            for(let j = 0;j<size;j++){
                this.matrix[i].push(0);
            }
        }
    }

    /**
    * Retourne la taille du graphe
    * @return le nombre de noeuds du graphe
    */
    size(){
        return this.matrix.length;
    }

    /**
    * Retourne le nombre d'arcs
    * @return le nombre d'arcs du graphe
    */
    edgeCount(){

        var edgeCount = 0;
        for(var i = 1;i<=this.size();i++){
            for(var j = 1;j<=this.size();j++){
                if(this.isEdge(i, j)){
                    edgeCount++;
                }
            }
        }

        return edgeCount;
    }

    /**
    * Ajoute un arc entre deux points
    * @param a : point de départ de l'arc
    * @param b : point d'arrivée de l'arc
    */
    addEgde(a,b){
        this.matrix[a-1][b-1] = 1;
    }

    /**
    * Supprime un arc du graphe
    * @param a : point de départ de l'arc
    * @param b : point d'arrivée de l'arc
    */
    removeEdge(a,b){
        this.matrix[a-1][b-1] = 0;
    }

    /**
    * Vérifie si un graphe contient des sommets ou si il est vide
    * @return TRUE si le graphe est vide | FALSE sinon
    */
    isEmpty(){
        for(var i = 1;i<=this.size();i++){
            for(var j = 1;j<=this.size();j++){
                if(this.isEdge(i, j)){
                    return false;
                }
            }
        }

        return true;
    }

    /**
    * Vérifie si un arc éxiste entre deux points
    * @return TRUE si l'arc existe | FALSE sinon
    */
    isEdge(a,b){
        return this.matrix[a-1][b-1] > 0;
    }

    /**
    * Vérifie si un graphe contient un sommet en particulier
    * @return TRUE si le sommet est vide | FALSE sinon
    */
    isVertice(a){
        if(a > 0 && a <= size()){
            return true;
        }

        return false;
    }

    /**
    * Calcul le dégré entrant d'un sommet
    * @return la valeur du degré entrant d'un sommet
    */
    getIncomingDegree(a){
        var degree = 0;

        for(var j = 1;j<=this.size();j++){
            if(this.isEdge(j, a)){
                degree++;
            }
        }

        return degree;
    }

    /**
    * Calcul le dégré sortant d'un sommet
    * @return la valeur du degré sortant d'un sommet
    */
    getOutgoingDegree(a){
        var degree = 0;

        for(var j = 1;j<=this.size();j++){
            if(this.isEdge(a, j)){
                degree++;
            }
        }

        return degree;
    }

    /**
    * Calcul Liste les successeurs d'un sommet
    * @return une liste de sommets
    */
    getSuccessors(a){
        var vertices = [];

        for(var j = 1;j<=this.size();j++){
            if(this.isEdge(a, j)){
                vertices.push(j);
            }
        }

        return vertices;
    }

    /**
    * Liste les prédécesseurs d'un sommet
    * @return une liste de sommets
    */
    getPredecessors(a){
        var vertices = [];

        for(var j = 1;j<=this.size();j++){
            if(this.isEdge(j, a)){
                vertices.push(j);
            }
        }

        return vertices;
    }

    /**
    * Crée un clone du graphe
    * @return un nouveau graphe avec les mêmes sommets et les mêmes arcs
    */
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

    /**
    * Calcul la fermeture transitive d'un graphe
    * @return le graphe fermé
    */
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

    /**
    * Cherche la liste des CFC
    * @return une liste de CFC
    */
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

    /**
    * Prépare les données pour Vis.js
    * @return une liste de sommets
    */
    prepareNodesDataSet(){
        var nodes = [];
        for(var i=0;i<this.size();i++){
            nodes.push({id:i+1, label:(i+1).toString()});
        }

        return nodes;
    }

    /**
    * Prépare les arcs pour Vis.js
    * @return une liste d'arcs
    */
    prepareEdgesDataSet(){
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

    /**
    * Prépare l'affichage de la matrice d'adjacence d'un graphe
    * @return Un tableau HTML
    */
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
