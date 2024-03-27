import React from 'react'
import { Container, Content } from './styles'
import { 
  FaTimes, 
  FaHome, 
  FaEnvelope, 
  FaPhoneAlt,
  FaUserAlt, 
  FaAddressBook,
  FaArrowAltCircleLeft
} from 'react-icons/fa'

import SidebarItem from '../SidebarItem'

const Sidebar = ({ active }) => {

  const closeSidebar = () => {
    active(false)
  }

  return (
    <Container sidebar={active}>
      <FaTimes onClick={closeSidebar} />  
      <Content>
      <a href="http://localhost:3000/menu">
        <SidebarItem Icon={FaHome} Text="Home" />
      </a>
      <a href="http://192.168.0.213:3000/ramalcrud">
        <SidebarItem Icon={FaPhoneAlt} Text="Ramal" />
      </a>
      <a href="http://localhost:3000/coordenadoriacrud">
        <SidebarItem Icon={FaAddressBook} Text="Coordenadoria" />
      </a>
      <a href="http://localhost:3000/unidadecrud">
        <SidebarItem Icon={FaUserAlt} Text="Unidade" />
      </a>
      <a href="http://localhost:3000/cargocrud">
        <SidebarItem Icon={FaEnvelope} Text="Cargo" />
      </a>
      <a href="http://localhost:3000/">
        <SidebarItem Icon={FaArrowAltCircleLeft} Text="Sair" />
      </a>
      </Content>
    </Container>
  )
}

export default Sidebar