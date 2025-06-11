require("dotenv").config()
const mongoose = require('mongoose');
const Product = require('./models/product');
const Client = require('./models/client');
const Worker = require('./models/worker');
const RentalHistory = require('./models/rentalHistory');

// Połączenie z bazą danych
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Połączono z MongoDB'))
    .catch(err => console.error('Błąd połączenia z MongoDB:', err));

const seedDatabase = async () => {
    try {
        // Czyszczenie istniejących danych
        await Product.deleteMany({});
        await Client.deleteMany({});
        await Worker.deleteMany({});
        await RentalHistory.deleteMany({});

        console.log('Usunięto istniejące dane');

        // Dodawanie pracowników
        const workers = [
            {
                name: "Marek Kowalczyk",
                email: "marek.kowalczyk@example.com",
                phone: "+48111000111",
                position: "manager"
            },
            {
                name: "Karolina Zielińska",
                email: "karolina.zielinska@example.com",
                phone: "+48222000222",
                position: "casual"
            },
            {
                name: "Michał Szymański",
                email: "michal.szymanski@example.com",
                phone: "+48333000333",
                position: "casual"
            },
            {
                name: "Aleksandra Wójcik",
                email: "aleksandra.wojcik@example.com",
                phone: "+48444000444",
                position: "manager"
            }
        ];
        const createdWorkers = await Worker.insertMany(workers);
        console.log(`Dodano ${createdWorkers.length} pracowników`);

        // Dodawanie klientów
        const clients = [
            {
                name: "Jan Kowalski",
                email: "jan.kowalski@example.com",
                phone: "+48123456789",
                address: {
                    street: "Marszałkowska 12",
                    city: "Warszawa"
                },
                rank: "silver"
            },
            {
                name: "Anna Nowak",
                email: "anna.nowak@example.com",
                phone: "+48987654321",
                address: {
                    street: "Długa 7",
                    city: "Kraków"
                },
                rank: "gold"
            },
            {
                name: "Piotr Wiśniewski",
                email: "piotr.wisniewski@example.com",
                phone: "+48555666777",
                address: {
                    street: "Mickiewicza 15",
                    city: "Poznań"
                },
                rank: "bronze"
            },
            {
                name: "Agnieszka Dąbrowska",
                email: "agnieszka.dabrowska@example.com",
                phone: "+48111222333",
                address: {
                    street: "Słowackiego 22",
                    city: "Wrocław"
                },
                rank: "bronze"
            },
            {
                name: "Tomasz Lewandowski",
                email: "tomasz.lewandowski@example.com",
                phone: "+48444555666",
                address: {
                    street: "Sienkiewicza 8",
                    city: "Gdańsk"
                },
                rank: "silver"
            }
        ];
        const createdClients = await Client.insertMany(clients);
        console.log(`Dodano ${createdClients.length} klientów`);

        // Przygotowanie produktów z recenzjami powiązanymi z klientami
        const productsData = [
            {
                title: "Wiedźmin 3: Dziki Gon",
                description: "Trzecia część serii gier o Wiedźminie, oparta na prozie Andrzeja Sapkowskiego",
                category: "RPG",
                type: "game",
                status: "available",
                condition: "good",
                reviews: [
                    {
                        rating: 5,
                        comment: "Najlepsza gra RPG w jaką grałem, świetny świat i fabuła",
                        date: new Date("2023-01-15"),
                        clientId: createdClients[0]._id // Jan Kowalski
                    },
                    {
                        rating: 4,
                        comment: "Genialna fabuła, choć miejscami gra miała problemy z optymalizacją",
                        date: new Date("2023-02-20"),
                        clientId: createdClients[1]._id // Anna Nowak
                    }
                ]
            },
            {
                title: "Harry Potter i Kamień Filozoficzny",
                description: "Pierwsza część serii o młodym czarodzieju",
                category: "Fantasy",
                type: "book",
                status: "available",
                condition: "new",
                reviews: [
                    {
                        rating: 5,
                        comment: "Książka, która przenosi do magicznego świata. Idealna dla dzieci i dorosłych",
                        date: new Date("2023-03-10"),
                        clientId: createdClients[2]._id // Piotr Wiśniewski
                    }
                ]
            },
            {
                title: "Incepcja",
                description: "Film science fiction w reżyserii Christophera Nolana",
                category: "Science Fiction",
                type: "movie",
                status: "available",
                condition: "good",
                reviews: [
                    {
                        rating: 5,
                        comment: "Arcydzieło, które trzeba obejrzeć kilka razy by zrozumieć wszystkie wątki",
                        date: new Date("2023-02-05"),
                        clientId: createdClients[3]._id // Agnieszka Dąbrowska
                    },
                    {
                        rating: 4,
                        comment: "Fabuła bardzo złożona, ale wciągająca. Film na kilka seansów",
                        date: new Date("2023-04-12"),
                        clientId: createdClients[4]._id // Tomasz Lewandowski
                    }
                ]
            },
            {
                title: "Władca Pierścieni: Drużyna Pierścienia",
                description: "Pierwsza część trylogii fantasy na podstawie powieści J.R.R. Tolkiena",
                category: "Fantasy",
                type: "movie",
                status: "rented",
                condition: "fair",
                reviews: [
                    {
                        rating: 5,
                        comment: "Klasyka gatunku fantasy, absolutnie genialne",
                        date: new Date("2023-01-30"),
                        clientId: createdClients[0]._id // Jan Kowalski
                    }
                ]
            },
            {
                title: "Metro 2033",
                description: "Postapokaliptyczna powieść Dmitrija Głuchowskiego",
                category: "Science Fiction",
                type: "audiobook",
                status: "available",
                condition: "new",
                reviews: [
                    {
                        rating: 4,
                        comment: "Wciągająca fabuła, klimatyczna postapokalipsa",
                        date: new Date("2023-04-05"),
                        clientId: createdClients[1]._id // Anna Nowak
                    },
                    {
                        rating: 3,
                        comment: "Dobra historia, ale miejscami zbyt powolna akcja",
                        date: new Date("2023-05-18"),
                        clientId: createdClients[2]._id // Piotr Wiśniewski
                    }
                ]
            },
            {
                title: "The Dark Side of the Moon",
                description: "Kultowy album zespołu Pink Floyd",
                category: "Rock",
                type: "music",
                status: "damaged",
                condition: "poor",
                reviews: [
                    {
                        rating: 5,
                        comment: "Najlepszy album w historii rocka. Ponadczasowy",
                        date: new Date("2023-03-28"),
                        clientId: createdClients[3]._id // Agnieszka Dąbrowska
                    }
                ]
            },
            {
                title: "FIFA 23",
                description: "Symulator piłki nożnej",
                category: "Sport",
                type: "game",
                status: "available",
                condition: "fair",
                reviews: [
                    {
                        rating: 3,
                        comment: "Mało zmian w stosunku do poprzedniej części",
                        date: new Date("2023-02-14"),
                        clientId: createdClients[4]._id // Tomasz Lewandowski
                    },
                    {
                        rating: 4,
                        comment: "Poprawiona fizyka piłki i nowe tryby gry",
                        date: new Date("2023-03-22"),
                        clientId: createdClients[0]._id // Jan Kowalski
                    }
                ]
            },
            {
                title: "Sapiens: Od zwierząt do bogów",
                description: "Książka Yuvala Noaha Harariego o historii ludzkości",
                category: "Non-fiction",
                type: "book",
                status: "reserved",
                condition: "good",
                reviews: [
                    {
                        rating: 5,
                        comment: "Fascynujące spojrzenie na historię i ewolucję ludzkości",
                        date: new Date("2023-05-01"),
                        clientId: createdClients[1]._id // Anna Nowak
                    },
                    {
                        rating: 4,
                        comment: "Bardzo pouczająca i skłaniająca do refleksji",
                        date: new Date("2023-04-15"),
                        clientId: createdClients[2]._id // Piotr Wiśniewski
                    }
                ]
            }
        ];

        const createdProducts = await Product.insertMany(productsData);
        console.log(`Dodano ${createdProducts.length} produktów`);

        // Dodawanie historii wypożyczeń
        const rentalHistories = [
            {
                product: createdProducts[0]._id, // Wiedźmin 3
                client: createdClients[0]._id, // Jan Kowalski
                worker: createdWorkers[1]._id, // Karolina Zielińska
                rentalPeriod: {
                    start: new Date("2023-05-01"),
                    end: new Date("2023-05-15"),
                    returned: new Date("2023-05-14")
                },
                status: "completed",
                notes: "Zwrócono w terminie, bez uszkodzeń",
                conditionBefore: "good",
                conditionAfter: "good"
            },
            {
                product: createdProducts[3]._id, // Władca Pierścieni
                client: createdClients[1]._id, // Anna Nowak
                worker: createdWorkers[2]._id, // Michał Szymański
                rentalPeriod: {
                    start: new Date("2023-06-10"),
                    end: new Date("2023-06-24"),
                },
                status: "rented",
                notes: "Klient chciał wydanie reżyserskie",
                conditionBefore: "fair",
            },
            {
                product: createdProducts[6]._id, // FIFA 23
                client: createdClients[2]._id, // Piotr Wiśniewski
                worker: createdWorkers[3]._id, // Aleksandra Wójcik
                rentalPeriod: {
                    start: new Date("2023-04-20"),
                    end: new Date("2023-05-04"),
                    returned: new Date("2023-05-10")
                },
                status: "overdue",
                notes: "Zwrócono po terminie, naliczono dodatkową opłatę",
                conditionBefore: "fair",
                conditionAfter: "fair"
            },
            {
                product: createdProducts[5]._id, // The Dark Side of the Moon
                client: createdClients[4]._id, // Tomasz Lewandowski
                worker: createdWorkers[0]._id, // Marek Kowalczyk
                rentalPeriod: {
                    start: new Date("2023-03-15"),
                    end: new Date("2023-03-29"),
                    returned: new Date("2023-03-28")
                },
                status: "damaged",
                notes: "Płyta zwrócona porysowana",
                conditionBefore: "good",
                conditionAfter: "poor"
            }
        ];
        const createdRentals = await RentalHistory.insertMany(rentalHistories);
        console.log(`Dodano ${createdRentals.length} historii wypożyczeń`);

        console.log('Baza danych została pomyślnie wypełniona!');
    } catch (error) {
        console.error('Błąd podczas wypełniania bazy danych:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();