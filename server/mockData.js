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
                status: "returned",
                notes: "Zwrócono w terminie, bez uszkodzeń",
                conditionBefore: "good",
                conditionAfter: "good",
                priceCharged: 25.00
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
                priceCharged: 15.00
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
                conditionAfter: "fair",
                priceCharged: 35.00
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
                conditionAfter: "poor",
                priceCharged: 40.00
            },
            {
                product: createdProducts[1]._id, // Harry Potter
                client: createdClients[3]._id, // Agnieszka Dąbrowska
                worker: createdWorkers[1]._id, // Karolina Zielińska
                rentalPeriod: {
                    start: new Date("2023-01-10"),
                    end: new Date("2023-01-24"),
                    returned: new Date("2023-01-23")
                },
                status: "returned",
                notes: "Klient bardzo zadowolony",
                conditionBefore: "new",
                conditionAfter: "good",
                priceCharged: 12.00
            },
            {
                product: createdProducts[2]._id, // Incepcja
                client: createdClients[0]._id, // Jan Kowalski
                worker: createdWorkers[0]._id, // Marek Kowalczyk
                rentalPeriod: {
                    start: new Date("2023-02-05"),
                    end: new Date("2023-02-12"),
                    returned: new Date("2023-02-14")
                },
                status: "overdue",
                notes: "Klient zapomniał o terminie zwrotu",
                conditionBefore: "good",
                conditionAfter: "good",
                priceCharged: 22.00
            },
            {
                product: createdProducts[4]._id, // Metro 2033
                client: createdClients[1]._id, // Anna Nowak
                worker: createdWorkers[3]._id, // Aleksandra Wójcik
                rentalPeriod: {
                    start: new Date("2023-03-01"),
                    end: new Date("2023-03-15"),
                    returned: new Date("2023-03-10")
                },
                status: "returned",
                notes: "Klient zwrócił wcześniej",
                conditionBefore: "new",
                conditionAfter: "new",
                priceCharged: 18.00
            },
            {
                product: createdProducts[7]._id, // Sapiens
                client: createdClients[2]._id, // Piotr Wiśniewski
                worker: createdWorkers[2]._id, // Michał Szymański
                rentalPeriod: {
                    start: new Date("2023-05-25"),
                    end: new Date("2023-06-08")
                },
                status: "rented",
                notes: "Klient zainteresowany kupnem po przeczytaniu",
                conditionBefore: "good",
                priceCharged: 20.00
            },
            {
                product: createdProducts[0]._id, // Wiedźmin 3
                client: createdClients[4]._id, // Tomasz Lewandowski
                worker: createdWorkers[1]._id, // Karolina Zielińska
                rentalPeriod: {
                    start: new Date("2023-04-05"),
                    end: new Date("2023-04-19"),
                    returned: new Date("2023-04-18")
                },
                status: "returned",
                notes: "Klient zachwycony grą",
                conditionBefore: "good",
                conditionAfter: "good",
                priceCharged: 25.00
            },
            {
                product: createdProducts[2]._id, // Incepcja
                client: createdClients[1]._id, // Anna Nowak
                worker: createdWorkers[0]._id, // Marek Kowalczyk
                rentalPeriod: {
                    start: new Date("2023-05-20"),
                    end: new Date("2023-06-03")
                },
                status: "rented",
                notes: "Film na weekend",
                conditionBefore: "good",
                priceCharged: 15.00
            },
            {
                product: createdProducts[1]._id, // Harry Potter
                client: createdClients[0]._id, // Jan Kowalski
                worker: createdWorkers[3]._id, // Aleksandra Wójcik
                rentalPeriod: {
                    start: new Date("2023-02-15"),
                    end: new Date("2023-03-01"),
                    returned: new Date("2023-02-25")
                },
                status: "returned",
                notes: "Wypożyczenie dla dzieci",
                conditionBefore: "new",
                conditionAfter: "good",
                priceCharged: 12.00
            },
            {
                product: createdProducts[6]._id, // FIFA 23
                client: createdClients[3]._id, // Agnieszka Dąbrowska
                worker: createdWorkers[2]._id, // Michał Szymański
                rentalPeriod: {
                    start: new Date("2023-05-15"),
                    end: new Date("2023-05-29"),
                    returned: new Date("2023-05-22")
                },
                status: "returned",
                notes: "Prezent dla syna",
                conditionBefore: "fair",
                conditionAfter: "fair",
                priceCharged: 30.00
            },
            {
                product: createdProducts[4]._id, // Metro 2033
                client: createdClients[2]._id, // Piotr Wiśniewski
                worker: createdWorkers[1]._id, // Karolina Zielińska
                rentalPeriod: {
                    start: new Date("2023-01-20"),
                    end: new Date("2023-02-03"),
                    returned: new Date("2023-02-05")
                },
                status: "overdue",
                notes: "Zwrócono z małym opóźnieniem",
                conditionBefore: "new",
                conditionAfter: "good",
                priceCharged: 20.00
            },
            {
                product: createdProducts[0]._id, // Wiedźmin 3
                client: createdClients[2]._id, // Piotr Wiśniewski
                worker: createdWorkers[0]._id, // Marek Kowalczyk
                rentalPeriod: {
                    start: new Date("2023-02-20"),
                    end: new Date("2023-03-06"),
                    returned: new Date("2023-03-04")
                },
                status: "returned",
                notes: "Klient ponownie wypożyczy",
                conditionBefore: "good",
                conditionAfter: "good",
                priceCharged: 25.00
            },
            {
                product: createdProducts[5]._id, // The Dark Side of the Moon
                client: createdClients[3]._id, // Agnieszka Dąbrowska
                worker: createdWorkers[2]._id, // Michał Szymański
                rentalPeriod: {
                    start: new Date("2023-01-05"),
                    end: new Date("2023-01-19"),
                    returned: new Date("2023-01-19")
                },
                status: "returned",
                notes: "Klient zainteresowany innymi albumami",
                conditionBefore: "fair",
                conditionAfter: "fair",
                priceCharged: 15.00
            },
            {
                product: createdProducts[2]._id, // Incepcja
                client: createdClients[4]._id, // Tomasz Lewandowski
                worker: createdWorkers[3]._id, // Aleksandra Wójcik
                rentalPeriod: {
                    start: new Date("2023-04-10"),
                    end: new Date("2023-04-17"),
                    returned: new Date("2023-04-16")
                },
                status: "returned",
                notes: "Film na weekend",
                conditionBefore: "good",
                conditionAfter: "good",
                priceCharged: 15.00
            },
            {
                product: createdProducts[3]._id, // Władca Pierścieni
                client: createdClients[0]._id, // Jan Kowalski
                worker: createdWorkers[1]._id, // Karolina Zielińska
                rentalPeriod: {
                    start: new Date("2023-03-25"),
                    end: new Date("2023-04-08"),
                    returned: new Date("2023-04-10")
                },
                status: "overdue",
                notes: "Niewielkie opóźnienie",
                conditionBefore: "fair",
                conditionAfter: "fair",
                priceCharged: 18.00
            },
            {
                product: createdProducts[7]._id, // Sapiens
                client: createdClients[4]._id, // Tomasz Lewandowski
                worker: createdWorkers[0]._id, // Marek Kowalczyk
                rentalPeriod: {
                    start: new Date("2023-04-01"),
                    end: new Date("2023-04-15"),
                    returned: new Date("2023-04-14")
                },
                status: "returned",
                notes: "Klient polecił książkę znajomym",
                conditionBefore: "good",
                conditionAfter: "good",
                priceCharged: 20.00
            },
            {
                product: createdProducts[1]._id, // Harry Potter
                client: createdClients[1]._id, // Anna Nowak
                worker: createdWorkers[2]._id, // Michał Szymański
                rentalPeriod: {
                    start: new Date("2023-04-25"),
                    end: new Date("2023-05-09"),
                    returned: new Date("2023-05-09")
                },
                status: "returned",
                notes: "Klient zainteresowany kolejnymi częściami",
                conditionBefore: "good",
                conditionAfter: "fair",
                priceCharged: 12.00
            },
            {
                product: createdProducts[4]._id, // Metro 2033
                client: createdClients[3]._id, // Agnieszka Dąbrowska
                worker: createdWorkers[0]._id, // Marek Kowalczyk
                rentalPeriod: {
                    start: new Date("2023-05-15"),
                    end: new Date("2023-05-29")
                },
                status: "rented",
                notes: "Klient pierwszy raz wypożycza audiobook",
                conditionBefore: "good",
                priceCharged: 18.00
            },
            // Kilka przeterminowanych wypożyczeń
            {
                product: createdProducts[6]._id, // FIFA 23
                client: createdClients[0]._id, // Jan Kowalski
                worker: createdWorkers[1]._id, // Karolina Zielińska
                rentalPeriod: {
                    start: new Date("2023-05-01"),
                    end: new Date("2023-05-15")
                },
                status: "rented", // przeterminowane, ale jeszcze niezwrócone
                notes: "Klient nie zwrócił w terminie",
                conditionBefore: "fair",
                priceCharged: 30.00
            },
            {
                product: createdProducts[7]._id, // Sapiens
                client: createdClients[3]._id, // Agnieszka Dąbrowska
                worker: createdWorkers[3]._id, // Aleksandra Wójcik
                rentalPeriod: {
                    start: new Date("2023-04-15"),
                    end: new Date("2023-04-29")
                },
                status: "rented", // przeterminowane, ale jeszcze niezwrócone
                notes: "Klient poprosił o przedłużenie, ale nie zarejestrowano",
                conditionBefore: "good",
                priceCharged: 20.00
            },
            // Anulowane wypożyczenia
            {
                product: createdProducts[2]._id, // Incepcja
                client: createdClients[2]._id, // Piotr Wiśniewski
                worker: createdWorkers[1]._id, // Karolina Zielińska
                rentalPeriod: {
                    start: new Date("2023-01-15"),
                    end: new Date("2023-01-22"),
                    returned: new Date("2023-01-16")
                },
                status: "cancelled",
                notes: "Klient zmienił zdanie dzień po wypożyczeniu",
                conditionBefore: "good",
                conditionAfter: "good",
                priceCharged: 0.00
            },
            // Zagubione produkty
            {
                product: createdProducts[1]._id, // Harry Potter
                client: createdClients[4]._id, // Tomasz Lewandowski
                worker: createdWorkers[2]._id, // Michał Szymański
                rentalPeriod: {
                    start: new Date("2023-03-10"),
                    end: new Date("2023-03-24"),
                    returned: new Date("2023-04-05")
                },
                status: "lost",
                notes: "Klient zgubił książkę, obciążony kosztami",
                conditionBefore: "good",
                priceCharged: 50.00
            },
            // Klienci z wieloma wypożyczeniami jednocześnie
            {
                product: createdProducts[0]._id, // Wiedźmin 3
                client: createdClients[1]._id, // Anna Nowak
                worker: createdWorkers[0]._id, // Marek Kowalczyk
                rentalPeriod: {
                    start: new Date("2023-06-01"),
                    end: new Date("2023-06-15")
                },
                status: "rented",
                notes: "Klient wypożyczył kilka produktów na raz",
                conditionBefore: "good",
                priceCharged: 25.00
            },
            {
                product: createdProducts[4]._id, // Metro 2033
                client: createdClients[1]._id, // Anna Nowak (ta sama osoba, co wyżej)
                worker: createdWorkers[0]._id, // Marek Kowalczyk
                rentalPeriod: {
                    start: new Date("2023-06-01"),
                    end: new Date("2023-06-15")
                },
                status: "rented",
                notes: "Część pakietu wypożyczeń",
                conditionBefore: "good",
                priceCharged: 18.00
            },
            // Wielokrotne wypożyczenia tego samego produktu
            {
                product: createdProducts[0]._id, // Wiedźmin 3
                client: createdClients[3]._id, // Agnieszka Dąbrowska
                worker: createdWorkers[2]._id, // Michał Szymański
                rentalPeriod: {
                    start: new Date("2023-01-05"),
                    end: new Date("2023-01-19"),
                    returned: new Date("2023-01-17")
                },
                status: "returned",
                notes: "Pierwsze wypożyczenie tego produktu przez klienta",
                conditionBefore: "good",
                conditionAfter: "good",
                priceCharged: 25.00
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