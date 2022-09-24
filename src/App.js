import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import Form from './components/Form/Form';
import ContactList from './components/ContactList/ContactList';
import Filter from './components/Filter/Filter';
import { Container } from './components/Container/Container.styled';
import { TitlePage } from './components/Title/Title';
import { Heading } from './components/Heading/Heading';

export default class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  componentDidMount() {
    const getContacts = JSON.parse(localStorage.getItem('contacts'));
    if (getContacts) {
      this.setState({
        contacts: getContacts,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;
    if (prevState.contacts !== contacts) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  addContact = data => {
    if (this.isDublicate(data)) {
      return alert(`${data.name} is already in contacts`);
    }
    this.setState(prevState => {
      const newContact = {
        id: nanoid(),
        ...data,
      };
      return {
        contacts: [newContact, ...prevState.contacts],
      };
    });
  };
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };
  getFilteredContacts() {
    const { contacts, filter } = this.state;
    if (filter.length === 0) {
      return contacts;
    }
    const normalisedFilter = filter.toLowerCase();
    const filteredContacts = contacts.filter(({ name }) => {
      const normalizedName = name.toLowerCase();
      const result = normalizedName.includes(normalisedFilter);
      return result;
    });
    return filteredContacts;
  }

  isDublicate({ name }) {
    const { contacts } = this.state;
    const result = contacts.find(contact => contact.name === name);
    return result;
  }
  removeBook = id => {
    this.setState(prevState => {
      const newListContacts = prevState.contacts.filter(
        contact => contact.id !== id
      );
      return {
        contacts: newListContacts,
      };
    });
  };

  render() {
    const filterId = nanoid();
    const contacts = this.getFilteredContacts();

    return (
      <Container>
        <TitlePage text={'Phonebook'}></TitlePage>
        <Form addContact={this.addContact} />

        <Heading text={'Contacts'}></Heading>
        <Filter
          filterId={filterId}
          filter={this.state.filter}
          handleChange={this.handleChange}
        />
        <ContactList items={contacts} removeBook={this.removeBook} />
      </Container>
    );
  }
}
