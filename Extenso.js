			/*
				Desenvolvido por Pedro Abs
				em 21/06/2013 v1.00
				http://pedroabs.wordpress.com
			*/


			Function.prototype.extend = function(Parent){
				var p = new Parent();
				this.prototype = p;
				this.constructor = Parent;
			}
			
			String.prototype.trim = function(){
				return this.replace(/^\s+|\s+$/g,"");
			}
			
			function replace(str){
				return str.replace(",",".");
			}
			
			function Expression() {
				this.interpret;
				this.left = function(word, count){
					if (count > word.length) count = word.length;
					return word.substring(0,count);
				};
				this.right = function(word, count){
					return word.substring(word.length - count);
				}
			}
		
		
			
			function Extenso(){
			
				// protegendo a classe de ser executada como uma função
				if (!(this instanceof Extenso)) {
					return new Extenso();
				}
				
			
				//Extenso.extend(Expression);
				Expression.call(this);
				
				
				// Construtor de objeto privado ao seu contexto
				function Unidade() {
					// protegendo a classe de ser executada como uma função
					if (!(this instanceof Unidade)) {
						return new Unidade();
					}
					
					
					var map = new Array();		
					map[0] = "";
					map[1] = "um";
					map[2] = "dois";
					map[3] = "três";
					map[4] = "quatro";
					map[5] = "cinco";
					map[6] = "seis";
					map[7] = "sete";
					map[8] = "oito"
					map[9] = "nove";

					this.interpret = function(numero){
						//new String(parseInt(numero)).length
						if(numero.length === 1){
							return map[numero];
						}
					}
				}
				
				// Construtor de objeto privado ao seu contexto
				function Dezena() {
					// protegendo a classe de ser executada como uma função
					if (!(this instanceof Dezena)) {
						return new Dezena();
					}
					
					var un = new Unidade();
					
					var map = new Array();			
					map[0] = "";
					map[1] = "dez";
					
					map[11] = "onze";
					map[12] = "doze";
					map[13] = "treze";
					map[14] = "quatorze";
					map[15] = "quinze";
					map[16] = "dezesseis";
					map[17] = "dezessete";
					map[18] = "dezoito"
					map[19] = "dezenove";
					
					map[2] = "vinte";
					map[3] = "trinta";
					map[4] = "quarenta";
					map[5] = "cinquenta";
					map[6] = "sessenta";
					map[7] = "setenta";
					map[8] = "oitenta"
					map[9] = "noventa";

					this.interpret = function(numero){
					
						var resposta;
						
						
						if(numero.length < 2){
							resposta = un.interpret(numero);
						} else {
							// pega os dois digitos a esquerda do número passado: Ex: 23 --> (23)
							var numeroComDoisDigitos = this.left(numero,2);
							
							resposta = map[numeroComDoisDigitos]
							
							// se não houver uma entrada correspondente no map ao número de dois digitos...
							if (resposta === undefined){
								// ... tentamos só com um digito. Ex: 23 --> (2)3
								var primeiroDigito = this.left(numero,1);
								resposta = map[primeiroDigito];

								// Pega a string remanescente. EX: 23 --> 2(3)
								var remanescente = this.right(numero,1);
								
								var unidade = un.interpret(remanescente);
								
								if (unidade === undefined){
									resposta;
								} else {
									resposta += " e " + unidade;
								}
								
							}
						}
						
						return resposta;
					}
				}
			
				// Construtor de objeto privado ao seu contexto
				function Centena() {
					// protegendo a classe de ser executada como uma função
					if (!(this instanceof Centena)) {
						return new Centena();
					}
					
					var dez = new Dezena();
					
					var map = new Array();	
					map[0] = "";				
					map[1] = "cento";
					map[100] = "cem";
					map[2] = "duzentos";
					map[3] = "trezentos";
					map[4] = "quatrocentos";
					map[5] = "quinhentos";
					map[6] = "seissentos";
					map[7] = "setecentos";
					map[8] = "oitocentos"
					map[9] = "novecentos";

					this.interpret = function(numero){
						var resposta;

						// verifica se o número possui pelo menos 3 casas
						if (numero.length < 3){
							// se o número possuir menos de 3 casas passe para a classe Dezena avaliar.
							resposta = dez.interpret(numero);
						} else {
							if (this.left(numero,3) === "100"){
								resposta = "cem";
							} else {
								// isolando o primeiro digito: Ex: 123 --> (1)23
								var primeiroDigito = this.left(numero,1);
								resposta = map[primeiroDigito];
								
								// pega o lado remanescente do número Ex: 1(23) --> 23
								var remanescente = this.right(numero,2);
								var dezena = dez.interpret(remanescente);

								if (dezena === undefined){
									resposta;
								} else {
									resposta += " e " + dezena;
								}
							}			
						}
						return resposta;
					}
				}
			

				Unidade.extend(Expression);
				Dezena.extend(Expression);
				Centena.extend(Expression);
				
								
				
				var map = new Array();			
				map[1] = "";
				map[2] = "mil ";
				map[22] = "mil ";
				map[3] = "milhão ";
				map[33] = "milhões ";
				map[4] = "bilhão ";
				map[44] = "bilhões ";
				map[5] = "trilhão";
				map[55] = "trilhões ";
				
				this.interpret = function(numero){
					var extensoParteInteira="";
					var extensoParteDecimal="";
					var parteInteira="";
					var parteDecimal="";		
					
					numero = replace(numero);
					
					var floatPosition = numero.indexOf(".");
					
					// Numero com parte inteira e decimal: 1.21
					if (floatPosition > 0) {
						parteInteira = numero.substring(0, floatPosition);
			
						//2º retorna o valor por extenso da parte inteira
						extensoParteInteira = interpretaNumero(parteInteira);

						//3º retorna o valor decimal por extenso
						parteDecimal = numero.substring(floatPosition+1);
						parteDecimal = this.left(parteDecimal,2);
						if (parteDecimal.length == 1) parteDecimal+="0";
						extensoParteDecimal = interpretaNumero(parteDecimal);
					}
					
					// Numero apenas com parte decimal: .21
					if (floatPosition == 0){
						//3º retorna o valor decimal por extenso
						parteDecimal = numero.substring(floatPosition+1);
						parteDecimal = this.left(parteDecimal,2);
						if (parteDecimal.length == 1) parteDecimal+="0";
						extensoParteDecimal = interpretaNumero(parteDecimal);
					}
					
					// Numero sem parte decimal: 121
					if (floatPosition < 0) {
						parteInteira = numero;
			
						//2º retorna o valor por extenso da parte inteira
						extensoParteInteira = interpretaNumero(parteInteira);
					}
					
					extensoParteInteira = extensoParteInteira.trim();
					extensoParteDecimal = extensoParteDecimal.trim();
			
					var Reais = (extensoParteInteira ==="")?"":" Reais";
					var Centavos = (extensoParteDecimal==="")?"":" Centavos";		

					//4º concatena e retorna resultado
					return extensoParteInteira + Reais + ((extensoParteInteira === "")?"":" ") + extensoParteDecimal + Centavos;
				}
				
				// Função privada
				function interpretaNumero(numero){
					var extenso="";
					var numbers = [];
					for (var i = numero.length; i > 0; i-=3){
						var n = i - 3 < 0 ? 0: i-3;
						numbers.push(numero.substring(n,i));
					}
					
					var subNumber = null;
					while(numbers.length > 0){
						var i = numbers.length;
						subNumber = numbers.pop();
						
						var ex = new Centena();
						extenso += ex.interpret(subNumber) + " " + getFromMap(map, i, subNumber)
					}
					return extenso;
				}
				// Função privada
				function getFromMap(map, toGet, value){
					var retorno = "";

					var val = parseInt(value);

					if (val == 0) return "";
					if(parseInt(value) > 1) toGet *= 11;
					retorno = map[toGet]
					if (retorno === undefined) return "";
					
					return retorno;
				}
			}
	
		