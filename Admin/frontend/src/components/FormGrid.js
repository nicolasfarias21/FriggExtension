// Importações necessárias
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";


// Estilos do Grid
const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  max-width: 1600px;
  margin: 20px auto;
`;

const Thead = styled.thead``;
const Tbody = styled.tbody``;
const Tr = styled.tr``;
const Th = styled.th`
  text-align: center;
  border-bottom: inset;
  padding-bottom: 5px;
`;
const Td = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "center")};
  width: ${(props) => (props.width ? props.width : "auto")};
`;
const TdIcon = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "center")};
  width: ${(props) => (props.width ? props.width : "auto")};
  background-color: #fff;
  cursor: pointer;
`;

// Estilos do Form
const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const StyledSelect = styled.select`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: ${(props) => (props.type === "clean" ? "black" : "green")};
  color: white;
  height: 42px;
`;

// Componente combinado
const FormGrid = ({ getUsers, onEdit, setOnEdit, users, setUsers }) => {
    const Title = styled.h2``;
  const ref = useRef();
  const [coordenadorias, setCoordenadorias] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [selectedCargo, setSelectedCargo] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [selectedUnidade, setSelectedUnidade] = useState("");
  const [coordenadoriaColors, setCoordenadoriaColors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8800/coordenadoriasativas")
      .then((response) => {
        setCoordenadorias(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar coordenadorias:", error);
        toast.error("Erro ao buscar dados. Tente novamente.");
      });

    axios
      .get("http://localhost:8800/cargossativos")
      .then((response) => {
        setCargos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar cargos:", error);
        toast.error("Erro ao buscar dados. Tente novamente.");
      });

    axios
      .get("http://localhost:8800/unidadesativas")
      .then((response) => {
        setUnidades(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar unidades:", error);
        toast.error("Erro ao buscar dados. Tente novamente.");
      });

    setSelectedUnidade("");
    setSelectedCargo("");

    if (onEdit) {
      const user = ref.current;

      user.Nome.value = onEdit.Nome;
      user.IdCoordenadoria.value = onEdit.IdCoordenadoria;
      user.IdUnidade.value = onEdit.IdUnidade;
      user.IdCargo.value = onEdit.IdCargo;
      user.Numero.value = onEdit.Numero;
      user.Status.value = onEdit.Status;
    }
  }, [onEdit]);

  const handleCargoChange = (e) => {
    setSelectedCargo(e.target.value);
  };

  const handleUnidadeChange = (e) => {
    setSelectedUnidade(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = ref.current;
    const selectedUnidadeValue = selectedUnidade || user.IdUnidade.value;
    const selectedCargoValue = selectedCargo || user.IdCargo.value;

    if (
      !user.Nome.value ||
      !user.IdCoordenadoria.value ||
      !selectedUnidadeValue ||
      !selectedCargoValue ||
      !user.Numero.value ||
      !user.Status.value
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    if (onEdit) {
      await axios
        .put("http://localhost:8800/" + onEdit.IdRamal, {
          Nome: user.Nome.value,
          IdCoordenadoria: user.IdCoordenadoria.value,
          IdUnidade: selectedUnidadeValue,
          IdCargo: selectedCargoValue,
          Numero: user.Numero.value,
          Status: user.Status.value === "true" ? 1 : 0,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    } else {
      await axios
        .post("http://localhost:8800/", {
          Nome: user.Nome.value,
          IdCoordenadoria: user.IdCoordenadoria.value,
          IdUnidade: selectedUnidadeValue,
          IdCargo: selectedCargoValue,
          Numero: user.Numero.value,
          Status: user.Status.value === "true" ? 1 : 0,
        })
        .then(({ data }) => toast.success(data))
        .catch(({ data }) => toast.error(data));
    }

    user.Nome.value = "";
    user.IdCoordenadoria.value = "";
    user.IdUnidade.value = "";
    user.IdCargo.value = "";
    user.Numero.value = "";
    user.Status.value = "";

    setOnEdit(null);
    getUsers();
  };

  const handleClear = () => {
    const user = ref.current;

    user.Nome.value = "";
    user.IdCoordenadoria.value = "";
    user.IdUnidade.value = "";
    user.IdCargo.value = "";
    user.Numero.value = "";
    user.Status.value = "";

    setOnEdit(null);
    toast.info("Os campos foram limpos!");
  };

  const handleEdit = (item) => {
    setOnEdit(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (IdRamal) => {
    await axios
      .delete("http://localhost:8800/" + IdRamal)
      .then(({ data }) => {
        const newArray = users.filter((user) => user.IdRamal !== IdRamal);

        setUsers(newArray);
        toast.success(data);
      })
      .catch(({ data }) => toast.error(data));

    setOnEdit(null);
  };

  useEffect(() => {
    // Gerar cores mais claras (tons pastel)
    const generateColor = () => {
      const letters = "ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 6)];
      }
      return color;
    };

    const updatedColors = { ...coordenadoriaColors };

    users.forEach((user) => {
      if (!updatedColors[user.NomeCoordenadoria]) {
        updatedColors[user.NomeCoordenadoria] = generateColor();
      }
    });

    setCoordenadoriaColors(updatedColors);
  }, [users, coordenadoriaColors]);

  return (
    <>
        <Title>Ramais</Title>
      <FormContainer ref={ref} onSubmit={handleSubmit}>
        <InputArea>
          <Label>Nome</Label>
          <Input name="Nome" />
        </InputArea>
        <InputArea>
          <Label>Coordenadoria</Label>
          <StyledSelect name="IdCoordenadoria">
            {coordenadorias.map((coordenadoria) => (
              <option
                key={coordenadoria.IdCoordenadoria}
                value={coordenadoria.IdCoordenadoria}
              >
                {coordenadoria.Nome}
              </option>
            ))}
          </StyledSelect>
        </InputArea>
        <InputArea>
          <Label>Unidade</Label>
          <StyledSelect name="IdUnidade" onChange={handleUnidadeChange}>
            {unidades.map((unidade) => (
              <option key={unidade.IdUnidade} value={unidade.IdUnidade}>
                {unidade.Nome}
              </option>
            ))}
          </StyledSelect>
        </InputArea>
        <InputArea>
          <Label>Cargo</Label>
          <StyledSelect name="IdCargo" onChange={handleCargoChange}>
            {cargos.map((cargo) => (
              <option key={cargo.IdCargo} value={cargo.IdCargo}>
                {cargo.Nome}
              </option>
            ))}
          </StyledSelect>
        </InputArea>
        <InputArea>
          <Label>Ramal</Label>
          <Input name="Numero" />
        </InputArea>
        <InputArea>
          <Label>Status</Label>
          <StyledSelect name="Status">
            <option value="false">Desativo</option>
            <option value="true">Ativo</option>
          </StyledSelect>
        </InputArea>
        <Button type="submit">Salvar</Button>
        <Button type="clean" onClick={handleClear}>
          Limpar
        </Button>
      </FormContainer>

      <Table>
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Coordenadoria</Th>
            <Th>Unidade</Th>
            <Th>Cargo</Th>
            <Th>Ramal</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((item, i) => (
            <Tr key={i} style={{ background: coordenadoriaColors[item.NomeCoordenadoria] }}>
              <Td width="30%">{item.Nome}</Td>
              <Td width="30%">{item.NomeCoordenadoria}</Td>
              <Td width="30%">{item.NomeUnidade}</Td>
              <Td width="30%">{item.NomeCargo}</Td>
              <Td width="30%">{item.Numero}</Td>
              <Td width="30%">{item.Status === 1 ? 'Ativo' : 'Desativado'}</Td>
              <TdIcon alignCenter width="5%">
                <FaEdit onClick={() => handleEdit(item)} />
              </TdIcon>
              <TdIcon alignCenter width="5%">
                <FaTrash onClick={() => handleDelete(item.IdRamal)} />
              </TdIcon>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default FormGrid;
