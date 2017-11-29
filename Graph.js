class Graph {

    /**
    * Constructeur de la classe Graph
    * @param size : Taille du nouveau graphe
    */
    constructor(size) {
        this.matrix = [];

        //On remplit une matrice de taille size*size de 0 pour créer un graphe vide
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
        //Pour tout les arcs possibles dans le graphe
        for(var i = 1;i<=this.size();i++){
            for(var j = 1;j<=this.size();j++){
                //On vérifie si l'arc existe
                if(this.isEdge(i, j)){
                    //et on incrémente un compteur
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
        //Pour tout les arcs possibles dans un graphe
        for(var i = 1;i<=this.size();i++){
            for(var j = 1;j<=this.size();j++){
                //Si un arc existe c'est que le graphe n'est pas vide
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
        //Si une case de la matrice est différente de 0 c'est que l'arc existe
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

        //Pour tous les prédécesseurs possibles d'un sommet
        for(var j = 1;j<=this.size();j++){
            //On vérifie si un arc existe
            if(this.isEdge(j, a)){
                //Et on incrémente un compteur
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
            //Pour tous les succésseurs possibles d'un sommet
            if(this.isEdge(a, j)){
                //On vérifie si un arc existe
                degree++;
                //Et on incrémente un compteur
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

        //Pour tous les succésseurs possibles d'un sommet
        for(var j = 1;j<=this.size();j++){
            //On vérifie si un arc existe
            if(this.isEdge(a, j)){
                //Et on place ce sommet dans un tableau
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

        //Pour tous les prédécesseurs possibles d'un sommet
        for(var j = 1;j<=this.size();j++){
            //On vérifie si un arc existe
            if(this.isEdge(j, a)){
                //Et on place ce sommet dans un tableau
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
        //On crée un nouveau graphe de la taille de l'actuel
        var G = new Graph(this.size());

        //Pour tous les arcs
        for(var i = 1;i<=this.size();i++){
            for(var j = 1;j<=this.size();j++){
                if(this.isEdge(i, j)){
                    //On les recopient dans le nouveau graphe
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

        //Pour tous les noeuds
        for(var i=0;i<n;i++){
            //Et tous les arcs possibles
            for(var x=0;x<n;x++){
                for(var y=0;y<n;y++){
                    //On crée un arc entre prédecesseurs et succésseurs du sommet
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
        //On applique une fermeture transitive sur le graphe
        //On a ainsi tous les chemins possibles d'un graphe
        let G = this.transitiveClosing();
        let n = G.size();
        let NE = [];

        //On remplit un tableau de noeuds à traiter
        for(var i=0;i<this.size();i++){
            NE.push(i+1);
        }
        let cfcs = [];

        //Pour tous les sommets
        for(var i=1;i<=n;i++){

            var index = NE.indexOf(i);

            //Si il est encore présent dans le tableau de noeuds à traiter
            //Donc qu'il n'est pas encore dans une CFC
            if(index > -1){
                //On crée une nouvelle CFC
                var cfc = [];
                //Et on supprime le sommet du tableau des noeuds à traiter
                cfc.push(i);
                NE.splice(index, 1);

                //Si le sommet est dans un cycle
                if(G.isEdge(i,i)){
                    //On cherche pour tous les sommets après celui-ci
                    for(var j=i+1;j<=n+1;j++){
                        //Si il est dans le même cycle
                        if(G.isEdge(i,j) && G.isEdge(j,i)){
                            //dans ce cas on ajoute le sommet à la cfc en cours
                            cfc.push(j);
                            //Et on supprime le sommet du tableau des noeuds à traiter
                            index = NE.indexOf(j);
                            NE.splice(index,1);
                        }
                    }
                }
                //On ajoute la CFC à la liste des Composantes Fortement Connexes
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
        //On crée un liste des sommets existants
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
        //Pour tout les sommets
        for(var i=0;i<this.size();i++){
            for(var j=0;j<this.size();j++){
                //On vérifie l'éxistence de chaque arc possible
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
