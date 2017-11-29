class GraphController {

    /**
    * Crée un graphe vide de la taille souhaitée
    * @param size : Taille du graphe
    */
    createGraph(size){
        this.g = new Graph(size);
        this.displayGraph(this.g, "graph", "verticeInfo");
        this.displayMatrix(this.g, "matrix");

        this.gplus = this.g.transitiveClosing();

        this.displayGraph(this.gplus, "graphWarshall", "warshallVerticeInfo");
        this.displayMatrix(this.gplus, "warshall");
        this.displayGraphInfo(this.g, 'graphStatus');
    }

    /**
    * Crée un graphe de test composé de 12 noeuds
    */
    playTest(){
        this.createGraph(12);

        var edges = [
            {from:'1', to:[12]},
            {from:'2', to:[1,3]},
            {from:'3', to:[10]},
            {from:'4', to:[5,6]},
            {from:'5', to:[4,6]},
            {from:'6', to:[3,9]},
            {from:'7', to:[8,9]},
            {from:'8', to:[7]},
            {from:'9', to:[10]},
            {from:'10', to:[9]},
            {from:'11', to:[10]},
            {from:'12', to:[2,3]}
        ];

        for(var edge of edges){
            for(var to of edge.to){
                this.addEgde(edge.from, to);
            }
        }
    }

    /**
    * Crée un arc entre deux sommets
    * @param from : noeud de départ
    * @param to : noeud d'arrivé
    */
    addEgde(from, to){

        //SI ON CREE UN NOEUD MANUELLEMENT
        if(from == undefined && to == undefined){
            from = parseInt(document.getElementById('from').value);
            to = parseInt(document.getElementById('to').value);
        }

        this.g.addEgde(from, to);
        this.displayGraph(this.g, "graph", "verticeInfo");
        this.displayMatrix(this.g, "matrix");
        this.displayGraphInfo(this.g, "graphStatus");

        this.gplus = this.g.transitiveClosing();

        this.displayGraph(this.gplus, "graphWarshall", "warshallVerticeInfo");
        this.displayMatrix(this.gplus, "warshall")
        this.displayCFCS(this.g, "CFC");
        this.displayGraphInfo(this.gplus, "warshallGraphStatus");

        document.getElementById('from').value = "";
        document.getElementById('to').value = "";
    }

    /**
    * Affiche les données du graphe
    * @param g : graphe à afficher
    * @param selector : Selecteur CSS de la div où afficher le graphe
    * @param verticeInfoSelector : Selecteur CSS de la div où afficher les informations des noeuds
    */
    displayGraph(g, selector, verticeInfoSelector){

        var altThis = this;

        var nodesDataset = new vis.DataSet(g.prepareNodesDataSet());
        var edgesDataset = new vis.DataSet(g.prepareEdgesDataSet());

        // create a network
        var container = document.getElementById(selector);
        var data = {
            nodes: nodesDataset,
            edges: edgesDataset
        };
        var options = {};
        var network = new vis.Network(container, data, options);

        network.on( 'click', function(properties) {
            altThis.displayVerticeInfo(g,properties.nodes[0], verticeInfoSelector);
        });
    }

    /**
    * Affiche les informations liées à un graphe
    * @param g : un graphe
    * @param selector : Selecteur CSS de la div où afficher les informations
    */
    displayGraphInfo(g, selector) {
        var graphStatus = "";
        if(g.isEmpty()){
            graphStatus = "Le graphe est vide et contient "+g.size()+" sommets.";
        }else{
            graphStatus = "Le graphe contient "+this.g.size()+" sommets et "+g.edgeCount()+" arcs.";
        }
        document.getElementById(selector).innerHTML = graphStatus;
    }

    /**
    * Affiche les informations d'un sommets
    * @param g : graphe dont fait partie le point
    * @param v : point à afficher
    * @param verticeInfoSelector : Selecteur CSS de la div où afficher les informations du noeud
    */
    displayVerticeInfo(g,v, verticeInfoSelector){

        var html = "";

        html += "<strong>Successeurs de "+v+"</strong> : " + g.getSuccessors(v)+"<br />";
        html += "<strong>Prédécesseurs de "+v+"</strong> : " + g.getPredecessors(v)+"<br />";
        html += "<strong>Degré sortant de "+v+"</strong> : " + g.getOutgoingDegree(v)+"<br />";
        html += "<strong>Degré entrant de "+v+"</strong> : " + g.getIncomingDegree(v)+"<br />";


        document.getElementById(verticeInfoSelector).innerHTML = html;
    }


    /**
    * Affiche la matrice d'adjacence d'un graphe
    * @param g : graphe à afficher
    * @param selector : Sélecteur CSS de la Div dans laquelle afficher la matrice
    */
    displayMatrix(g, selector){
        document.getElementById(selector).innerHTML = g.asHTMLTable();
    }

    /**
    * Affiche les Composantes Fortement Connexes d'un graphe
    * @param g : graphe à afficher
    * @param selector : Sélecteur CSS de la Div dans laquelle afficher la liste des CFC
    */
    displayCFCS(g, selector){
        var cfcs = g.searchCFC();

        var ret = "<ul>";

        for(var cfc of cfcs){
            ret += "<li> cfc de "+cfc[0]+" : {";
            for(var n in cfc){
                ret += cfc[n];

                if(n < cfc.length-1){
                    ret += " ; ";
                }
            }
            ret += "}</li>";
        }

        ret += "</ul>";

        document.getElementById(selector).innerHTML = ret;

    }

}
