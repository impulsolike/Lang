/**
 * Lang
 *
 * Almacena, organiza y recupera textos
 * @author ImpulsoLike <opensource@impulsolike.net>
 * @version 1.0.0
 * @package Lang
 *
 */
(

    /**
     * Carga automatica
     * @param {Object} root - This según el scope global
     * @param {Object} factory - Fabrica del package
     *
     */
    function (root, factory) {

        /**
         * Ejecutamos la fabrica
         */
        return factory(root, {
            package     : 'Lang',
            version     : '1.0.0',
            docs        : 'https://apis.impulsolike.com/docs/Lang/1.x/',
            author      : 'ImpulsoLike <opensource@impulsolike.net>',
        });

    }

)(this, function (root, info) {

    /**
     * Variables Globales
     * @var {String} locale - Idioma seleccionado
     * @var {Object} messages - Mensajes agregados
     */
    var locale = 'en', messages = {};

    /**
     * Obtener mensaje texto
     * @function searchMessage()
     * @param {String} slug - Ruta del mensaje a recuperar
     * @param {Boolean} message - Si es true devuelve el texto, si es false devuelve boolean
     * @return {String|Object|Boolean}
     */
    var searchMessage = function (slug = null, message = true) {

        // Si esta vacio
        if (!slug) return '';

        // Creamos array selector
        var selector = slug.split('.');

        // Obtenemos todos los textos de idioma
        var result = messages;

        for (var key of selector) {

            // Si el key existe
            if (result[key]) {
                result = result[key];
            }
            // Si no existe
            else {
                return message ? slug : false;
            }

        }

        return message ? result : true;

    };

    /**
     * Añadir textos de idioma
     * @function addMessages()
     * @param {String} file - Nombre del archivo de idioma
     * @param {Object} content - Contenido del archivo de idioma
     */
    var addMessages = function (file = null, content = null) {

        // Si file es Object
        if (typeof file === 'object') {

            messages = file;

        }
        // Si file es String y content es Object
        else if (typeof file === 'string' && typeof content === 'object') {

            messages[file] = content;

        }

        return true;

    };

    /**
     * Seleccionar mensaje por contador
     * @function choiceMessage()
     * @param {String} message - Mensaje
     * @param {Number} count - Contador
     */
    var choiceMessage = function (message = null, count = null) {

        // Si esta vacio
        if (!message) return '';

        // Dividimos el mensaje
        var choice = message.split('|');

        // Hay mas de 2 opciones
        if (choice.length > 1) {

            // Verificador de consulta
            var i = 0;

            // Recorremos las elecciones
            for (var option of choice) {

                // {0} message
                if (/^\{\d+\}\s\S/gi.test(option)) {

                    i++;

                    var number = option.replace(/^(\{)(\d+)(\})(\s\S+(.+)?)/gi,'$2');

                    number = parseInt(number);

                    if (typeof number === 'number' && count == number) {

                        return option.replace(/^(\{\d+\}\s)(\S+(.+)?)/gi,'$2');

                    }

                }
                // [1,2] message
                else if (/^\[\d+\,\d+\]\s\S/gi.test(option)) {

                    i++;

                    var min = option.replace(/^(\[)(\d+)(\,\d+\])(\s\S+(.+)?)/gi,'$2');
                    var max = option.replace(/^(\[)(\d+\,)(\d+\])(\s\S+(.+)?)/gi,'$3');

                    min = parseInt(min);
                    max = parseInt(max);

                    if (typeof min === 'number' && typeof max === 'number' && count >= min && count <= max) {

                        return option.replace(/^(\[\d+\,\d+\]\s)(\S+(.+)?)/gi,'$2');

                    }

                }
                // [1,*] message
                else if (/^\[\d+\,\*\]\s\S/gi.test(option)) {

                    i++;

                    var number = option.replace(/^(\[)(\d+)(\,\*\])(\s\S+(.+)?)/gi,'$2');

                    number = parseInt(number);

                    if (typeof number === 'number' && count >= number) {

                        return option.replace(/^(\[\d+\,\*\]\s)(\S+(.+)?)/gi,'$2');

                    }

                }

            }


            if (!i) {

                if (choice.length == 2 && count > 0) {

                    switch (count) {
                        case 1:
                            message = choice[0];
                            break;
                        default:
                            message = choice[1];
                            break;
                    }

                }
                else if (choice.length == 3) {

                    switch (count) {
                        case 1:
                            message = choice[0];
                            break;
                        case 0:
                            message = choice[2];
                            break;
                        default:
                            message = choice[1];
                            break;
                    }

                }

            }

        } else {

            message = choice[0];

        }

        return message;

    };

    /**
     * Remplazar variables
     * @function replaceMessage()
     * @param {String} message - Mensaje original
     * @param {Object} replacements - Remplazar
     */
    var replaceMessage = function (message = null, replacements = null) {

        // Si esta vacio
        if (!message) return '';

        // Recorremos replacements
        for (var key in replacements) {

            var replacement = String(replacements[key]);

            // :name
            message = message.replace(
                new RegExp(':' + key, 'g'),
                replacement
            );

            // :NAME
            message = message.replace(
                new RegExp(':' + key.toUpperCase(), 'g'),
                replacement.toUpperCase()
            );

            // :Name
            message = message.replace(
                new RegExp(':' + (key.charAt(0).toUpperCase() + key.substr(1)), 'g'),
                replacement.charAt(0).toUpperCase() + replacement.substr(1)
            );

        }

        return message;

    };


    /**
     * Lang
     * @class
     */

    var Lang = function (){};

    /**
     * Establecer nuevo @var locale
     * @method Lang.set()
     */
    Lang.prototype.set = addMessages;

    /**
     * Comprueba si existe texto
     * @method Lang.has()
     * @param {String} slug - Ruta de texto a comprobar
     * @return {Boolean}
     */
    Lang.prototype.has = function (slug = null) {

        // Buscamos si existe el mensaje
        return searchMessage(slug,false);

    };

    /**
     * Obtener mensaje texto
     * @method Lang.get()
     * @param {String} slug - Ruta del mensaje a recuperar
     * @param {Object} replace - Objeto con valores a remplazar
     * @return {String}
     */
    Lang.prototype.get = function (slug = null, replacements = null) {

        // Buscamos el mensaje
        var message = searchMessage(slug);

        // Aplicamos los remplazos
        if (replacements && typeof message === 'string') {
            message = replaceMessage(message,replacements);
        }

        return message;

    };

    /**
     * Obtener mensaje según contador
     * @method Lang.choice()
     * @param {String} slug - Ruta del mensaje a recuperar
     * @param {Number} count - Contador
     * @param {Object} replace - Objeto con valores a remplazar
     * @return {String}
     */
    Lang.prototype.choice = function (slug = null, count = null, replacements = null) {

        // Buscamos el mensaje
        var message = searchMessage(slug);

        // Elegimos una opción
        message = choiceMessage(message,count);

        // Aplicamos los remplazos
        if (replacements && typeof message === 'string') {
            message = replaceMessage(message,replacements);
        }

        return message;

    };

    /**
     * Obtener el valor de @var locale
     * @method Lang.locale()
     * @param {String} localeId - Nombre del locale
     */
    Lang.prototype.locale = function () {

        return locale;

    };

    /**
     * Establecer nuevo @var locale
     * @method Lang.setLocale()
     * @param {String} localeId - Nombre del locale
     */
    Lang.prototype.setLocale = function (localeId = null) {

        locale = localeId;

    };

    /**
     * Consultamos la información del package
     * @method Lang.i()
     * @return {Object} - Retorna @var info
     */
    Lang.prototype.i = function () {

        return info;

    };

    /**
     * Creamos el Ojecto
     */
    Lang = new Lang;

    /**
     * Esta info solo es informativa, no debe usarse para validar nada
     */
    Lang.package    = info.package;
    Lang.version    = info.version;
    Lang.docs       = info.docs;
    Lang.author     = info.author;

    /**
     * Exportamos a root
     */
    root.Lang = Lang;
    root.trans = Lang.get;
    root.trans_choice = Lang.choice;

    return true;

});
