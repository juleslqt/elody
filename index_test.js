const Discord = require("discord.js");


const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

const mysql = require('mysql');
const Database = new mysql.createConnection({
    host: "sql585.main-hosting.eu",
    user: "u112063882_OD",
    password: "UlysseLeDep!18",
    database: "u112063882_odyssee",
})

const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        // Discord.Intents.FLAGS.GUILD_STORE
        Discord.Intents.FLAGS.GUILD_MESSAGES
        // Discord.Intents.FLAGS.DIRECT_MESSAGES
    ]
});

// const prefix = "!";

function upFirst(string) {
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string;
}


function deleteMessageSent(interaction,time,max) {
    const collector = interaction.channel.createMessageCollector({max : max,time: time });
    collector.on('end', collected => {
        if (collected.size == max) {
            setTimeout(() => {

                messages = new Array();
                collected.forEach(e => {
                    messages.unshift(e)
                });
                messages.forEach(e => {
                    e.delete();
                })

            },time - time/3)
        }
        
    })

    // interaction.channel.awaitMessages({ max: 1, time: 3000, errors: ['time'] })
	// 		.then(collected => {
	// 			interaction.followUp(`${collected.first().author} got the correct answer!`);
	// 		})
	// 		.catch(collected => {
	// 			interaction.followUp('Looks like nobody got the answer this time.');
	// 		});

}


// Options commande création d'une catégory

const createCategory = new SlashCommandBuilder()
    .setName("create-category")
    .setDescription("Crée une catégorie")
    .addStringOption(option => option
        .setName("nom")
        .setDescription("Nom du nouveau canal")
        .setRequired(true)
    );

// Options commande suppression d'une catégory

const deleteCategory = new SlashCommandBuilder()
    .setName("delete-category")
    .setDescription("Supprime une catégorie");


// Options commande test message embed

// const embedTest = new SlashCommandBuilder()
//     .setName("embed-test")
//     .setDescription("Créer un message embed");


Client.on("ready", async () => {

    await Client.guilds.cache.get("706919400359329925").commands.fetch()

    Client.guilds.cache.get("706919400359329925").commands.cache.map(command => { // 706919400359329925
        command.delete();
        console.log(command.name + ' effacée')
    });

    Client.guilds.cache.get("706919400359329925").commands.create(createCategory); // ajoute la commande uniquement au serveur selectionné par son identifiant.
    Client.guilds.cache.get("706919400359329925").commands.create(deleteCategory);
    // Client.guilds.cache.get("706919400359329925").commands.create(embedTest);

    console.log("Elody is ready.");
});

// Client.login(process.env.TOKEN);
Client.login("OTQ4MzMwMDM4MjE3MDMxNzQw.Yh6PLA.xTv74uTtUWSvmIHialSrkALZUa0");

Database.connect(function(err) {
    if(err) throw err;

    console.log('Connecté à la base de données !');
})



Client.on("guildMemberAdd", member =>  {

    // inside a command, event listener, etc.
    const welcomeEmbed = new Discord.MessageEmbed()
    .setColor('#ff0004')
    .setTitle('Bienvenue ' + member.user.username + ' !')
    .setDescription("Vous faites désormais partie de l'Odyssée ! \nCe serveur est le principal moyen de communication des membres.\n \u200B")
    .setThumbnail('https://odysseedegustation.com/Image/logo/odyssee_logo.png')
    .addFields(
        { name: 'Vous y trouverez :', value: '\u200B' },
        // { name: '\u200B', value: '\u200B' },
        { name: 'Des catégories', value: 'qui sont des onglets séparant les canaux de votre pôle et les canaux généraux. Les catégories sont aussi utilisées pour séparer les canaux spécifiques aux événements.', inline: false },
        { name: 'Des canaux vocaux', value: "qui permettent d'organiser des réunions en ligne. Certains sont accessibles par tous les membres et d'autres sont réservés aux membres d'un pôle.", inline: false },
        { name: 'Des canaux textuels', value: 'qui sont des conversations de groupe. Pour envoyer des messages dans ces canaux il vous faut créer ou rejoindre un sujet (fil de conversation).\n \u200B', inline: false },
        { name: 'Qui êtes vous ?', value: "Veuillez entrez votre nom, prénom de la manière ci-dessous.", inline: false },
        { name: 'nom,prénom', value: "Exemple : Sardou,Jean Paul", inline: false },
    )
    // .setImage('https://i.imgur.com/wSTFkRM.png')
    .setTimestamp()
    .setFooter({text : "Toute l'équipe de l'Odyssée vous souhaite la bienvenue !", iconURL : 'https://odysseedegustation.com/Image/logo/odyssee_logo.png'});



    member.guild.channels.create('Welcome', {
        type: 'GUILD_TEXT',
        permissionOverwrites: [
            {
                id: member.guild.id, // shortcut for @everyone role ID
                deny: 'VIEW_CHANNEL'
              },
              {
                id: member.id,
                allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES']
              }
    ]
    }).then(async channel => {
        category = Client.guilds.cache.get("706919400359329925").channels.cache.get('949173176498274304');

        category.permissionOverwrites.set([
            {
                id: member.guild.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: member.id,
                allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'],
            },
        ]);

        channel.setParent(category.id);

        await channel.permissionOverwrites.set([
            {
                id: member.guild.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: member.id,
                allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'],
            },
        ]);


        channel.send({ embeds: [welcomeEmbed] });

    })
    .catch(console.error);

});


Client.on('messageCreate', async message => {
    if (message.author.bot==true && message.author.id!='832731781231804447') return;
    

    if (message.channel.id === '949125019315863612') {
        
        if (message.author.id === '832731781231804447' && message.content == 'Nouvel événement\n@everyone') { // 832731781231804447

                var msgEmbed = message.embeds[0];
     
                var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
     
                function stringToDate(Time) {
                     mois = months.indexOf(Time[0]);
                     jour = Time[1].substring(0, Time[1].length - 1);
                     annee = Time[2];
                     heure = Time[4].split(':')[0];
                     cadran = Time[4].split(':')[1].substring(Time[4].split(':')[1].length - 2, Time[4].split(':')[1].length);
                     if (cadran == 'PM' && parseInt(heure) < 12) {
                        heure = (parseInt(heure)+12).toString()
                     }

                     minute = Time[4].split(':')[1].substring(0, Time[4].split(':')[1].length - 2);
                     
                     Time = new Date(annee, mois, jour, heure, minute) 
                     return Time;
                }

                nom = msgEmbed.title.split(' | ')[0];
     
                startTime = stringToDate(msgEmbed.description.split('\n')[0].split(' : ')[1].split(' '));

                endTime = stringToDate(msgEmbed.description.split('\n')[1].split(' : ')[1].split(' '));
                
                lieu = msgEmbed.description.split('\n')[2].split(' : ')[1];
     
                description = msgEmbed.description.split('\n')[5];
                

                Client.guilds.cache.get("706919400359329925").scheduledEvents            // .cache.forEach(e => console.log(e))
                .create({
                        name: nom,
                        privacyLevel: 'GUILD_ONLY',
                        scheduledStartTime: startTime,
                        scheduledEndTime: endTime,
                        description: description,
                        entityType:'EXTERNAL',
                        entityMetadata: {location: lieu}
                
                })
                
             

            
        }
    }


    if (message.channel.parent === Client.guilds.cache.get("706919400359329925").channels.cache.get('949173176498274304') ) {

        const regexTest = [...message.content.matchAll('^[a-zA-ZÜ-ü\-\\s]+,[a-zA-ZÜ-ü\-\\s]+$')];
        if (regexTest.length == 1) {
            var allName = regexTest[0][0];
            allName = allName.split(',')
            i=0;
            
            allName.forEach(word => {
                word = word.trim();
                word = word.split(' ');
                word = word.filter( function(val){return val !== ''})
                u=0;
                word.forEach(letter => {
                    word[u] = upFirst(letter.toLowerCase());
                    u+=1;
                })
                allName[i] = word.join(' ');
                i+=1;
            });

            nickName = allName[1] + ' ' + allName[0];
            message.guild.members.cache.get(message.author.id).setNickname(nickName);

            const roles = new Array();
            var i = 0;
            message.guild.roles.cache.forEach(role => {
                if (role.id !== "918547784834109470" && role.id !== "949025395225800717" && role.id !== "706919400359329925") {
                    roles.push(new Object);
                    roles[i].label = upFirst(role.name);
                    roles[i].value = role.id;
                    i+=1;
                }
            })

            const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('selected-pole')
					.setPlaceholder('Selectionner un pôle')
					.addOptions(
						roles
					),
			);

		    await message.channel.send({ content: 'Veuillez sélectionner le pôle duquel vous faites partie.', components: [row] });
        }
        else {

            // inside a command, event listener, etc.
                const errEmbed = new Discord.MessageEmbed()
                .setColor('#ff0004')
                .setTitle('Mauvaise syntaxe !')
                .setDescription("Veuillez écrire vos nom et prénom de la manière suivante\n \u200B")
                .addFields(
                    { name: 'Nom, Prénom', value: "Exemple : Sardou Kader, Jean Paul", inline: false },
                );

            message.channel.send({ embeds: [errEmbed] });

            
            
        };
    }

});

Client.on("interactionCreate", async interaction => {

    if (interaction.channel.id!="949023521760215060" && interaction.channel.parentId!="949173176498274304") {
        interaction.reply('Veuillez vous rendre dans le channel **Elody** pour réaliser cette commande.')
    }
    else {
    if (interaction.isCommand()) {

        // Création d'une catégorie remplie de channels

        if (interaction.commandName === "create-category") {

            // Fonction de création de channel

            function createChannel(name) {
                interaction.guild.channels.create(name, {
                    type: 'GUILD_TEXT',
                    permissionOverwrites: [{
                        id: interaction.guild.id,
                        allow: ['VIEW_CHANNEL'],
                        deny: ['SEND_MESSAGES'],
                    }]
                }).then(channel => channel.setParent(catID))
                .catch(console.error);
            }


            let nom = interaction.options.get("nom");

            interaction.guild.channels.create('# ' + nom.value, {
                type: 'GUILD_CATEGORY',
                permissionOverwrites: [{
                    id: interaction.guild.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['SEND_MESSAGES'],
                }]
            }).then(category => catID = category.id)
            .catch(console.error);

            createChannel('Communication');
            createChannel('Evenement Dégustation');
            createChannel('Levée de Fonds');
            createChannel('Secrétariat');
            createChannel('Trésorerie');
            createChannel('Présidence');
            

            interaction.reply("La catégorie **" + upFirst(nom.value) + "** a été créé !");
            deleteMessageSent(interaction,5000, 1);
            
        }

        // suppression d'une catégorie et ses channels

        else if (interaction.commandName === "delete-category") {

            
            var i = 0;
            const options = new Array();
            interaction.guild.channels.cache.forEach(channel => {
                if (channel.type === 'GUILD_CATEGORY' && channel.name.substring(0, 1) == '#' ) {
                    options.push(new Object);
                    options[i].label = upFirst(channel.name);
                    options[i].value = channel.id;
                    i+=1;
                }
                
            });

            if (options.length == 0) {
                deleteMessageSent(interaction,5000, 1)
                interaction.reply("Il n'y a pas de catégorie que vous pouvez supprimer.");
            }
            else {

            const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('deleted-category')
					.setPlaceholder('Selectionner une catégorie')
					.addOptions(
						options
					),
			);

            deleteMessageSent(interaction,20000, 2)
		    await interaction.reply({ content: 'Veuillez choisir la catégorie que vous souhaitez supprimer.', components: [row] });
            
            
        }
        
    }

    else if (interaction.commandName === "embed-test") {
        // inside a command, event listener, etc.
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#ff0004')
        .setTitle('Bienvenue USER_NAME !')
        .setDescription("Vous faites désormais partie de l'Odyssée ! \nCe serveur est le principal moyen de communication des membres.\n \u200B")
        .setThumbnail('https://odysseedegustation.com/Image/logo/odyssee_logo.png')
        .addFields(
            { name: 'Vous y trouverez :', value: '\u200B' },
            // { name: '\u200B', value: '\u200B' },
            { name: 'Des catégories', value: 'qui sont des onglets séparant les canaux de votre pôle et les canaux généraux. Les catégories sont aussi utilisées pour séparer les canaux spécifiques aux événements.', inline: false },
            { name: 'Des canaux vocaux', value: "qui permettent d'organiser des réunions en ligne. Certains sont accessibles par tous les membres et d'autres sont réservés aux membres d'un pôle.", inline: false },
            { name: 'Des canaux textuels', value: 'qui sont des conversations de groupe. Pour envoyer des messages dans ces canaux il vous faut créer ou rejoindre un sujet (fil de conversation).\n \u200B', inline: false },
            { name: 'Qui êtes vous ?', value: "Veuillez entrez votre nom, prénom et pôle de la manière ci-dessous.", inline: false },
            { name: 'nom-prénom-pôle', value: "\u200B", inline: false },
        )
        // .setImage('https://i.imgur.com/wSTFkRM.png')
        .setTimestamp()
        .setFooter({text : "Toute l'équipe de l'Odyssée vous souhaite la bienvenue !", iconURL : 'https://odysseedegustation.com/Image/logo/odyssee_logo.png'});

        interaction.channel.send({ embeds: [exampleEmbed] });

        }
        
    }



    

    if (interaction.isSelectMenu()) {

        if (interaction.customId === 'deleted-category') {
            const category = interaction.guild.channels.cache.get(interaction.values[0]);
            category.children.forEach( async channel => channel.delete());
            await category.delete();
            interaction.reply('La catégorie **' + upFirst(category.name) + '** a été supprimé avec succès.');
            
        }
        // suppression d'une catégorie et ses channels

        else if (interaction.customId === 'selected-pole') {

        // Add role 'New' to the member

            interaction.member.roles.add(interaction.guild.roles.cache.find(r => r.id === interaction.values[0]));

        
            category = Client.guilds.cache.get("706919400359329925").channels.cache.get('949173176498274304');

            interaction.channel.delete()
            .then(channel => category.permissionOverwrites.set([
                {
                    id: interaction.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.member.id,
                    deny: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'],
                },
            ]));

        }

    }
}
	    

});




