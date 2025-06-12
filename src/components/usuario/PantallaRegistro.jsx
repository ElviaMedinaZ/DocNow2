/**
 * Descripción: Diseño de vista Registro
 * Fecha: 11 Junio de 2025
 * Programador: Elvia Medina
 */

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';
import placeholder from '../../assets/avatar_placeholder.png';
import logo from '../../assets/logo.png';
import './RegistroStyle.css';

export default function RegistroWeb() {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidoP: '',
    apellidoM: '',
    curp: '',
    sexo: '',
    fechaNacimiento: null,
    estadoCivil: '',
    correoElectronico: '',
    telefono: '',
    contrasena: '',
    confirmar: '',
  });

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [errores, setErrores] = useState({});

  const opcionesEstadoCivil = [
    { label: 'Soltero/a', value: 'Soltero' },
    { label: 'Casado/a', value: 'Casado' },
    { label: 'Divorciado/a', value: 'Divorciado' },
    { label: 'Viudo/a', value: 'Viudo' },
  ];

  const handleChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const handleFotoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setFotoPerfil(URL.createObjectURL(archivo));
    }
  };

  const validarYEnviar = () => {
    const nuevosErrores = {};
    Object.entries(formData).forEach(([campo, valor]) => {
      if (!valor) nuevosErrores[campo] = true;
    });
    if (formData.contrasena !== formData.confirmar) {
      nuevosErrores.confirmar = true;
      alert('Las contraseñas no coinciden');
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      console.log('Formulario válido:', formData);
    }
  };

  return (
    <div className="RegistroContainer">
      <div className="RegistroForm">
        <img src={logo} alt="Logo" className="Logo" />
        <h2 className="Titulo">Registro</h2>
        <p className="Subtitulo">Llena los campos tal como aparecen en tus documentos oficiales.</p>

        <div className="FotoPreview">
          <img src={fotoPerfil || placeholder} alt="Avatar" className="PreviewImg" />
          <label className="FileLabel">
            Cambiar foto
            <input type="file" accept="image/*" onChange={handleFotoChange} hidden />
          </label>
        </div>

        <div className="PFluid">
          <InputText placeholder="Nombre(s)" className={errores.nombres ? 'PInvalid' : ''} value={formData.nombres} onChange={(e) => handleChange('nombres', e.target.value)} />
          <InputText placeholder="Apellido paterno" className={errores.apellidoP ? 'PInvalid' : ''} value={formData.apellidoP} onChange={(e) => handleChange('apellidoP', e.target.value)} />
          <InputText placeholder="Apellido materno" className={errores.apellidoM ? 'PInvalid' : ''} value={formData.apellidoM} onChange={(e) => handleChange('apellidoM', e.target.value)} />
          <InputText placeholder="CURP" className={errores.curp ? 'PInvalid' : ''} value={formData.curp} onChange={(e) => handleChange('curp', e.target.value)} />

        <div className="SexoGroup">
          <Button
            label="Masculino"
            icon="pi pi-male"
            severity="primary"
            outlined={formData.sexo !== 'M'}
            onClick={() => handleChange('sexo', 'M')}
          />
          <Button
            label="Femenino"
            icon="pi pi-female"
            severity="primary"
            outlined={formData.sexo !== 'F'}
            onClick={() => handleChange('sexo', 'F')}
          />
        </div>

          <Calendar value={formData.fechaNacimiento} onChange={(e) => handleChange('fechaNacimiento', e.value)} placeholder="Fecha de nacimiento" showIcon className={errores.fechaNacimiento ? 'PInvalid' : ''} />
          <Dropdown value={formData.estadoCivil} options={opcionesEstadoCivil} onChange={(e) => handleChange('estadoCivil', e.value)} placeholder="Estado civil" className={errores.estadoCivil ? 'PInvalid' : ''} />

          <InputText placeholder="Correo electrónico" className={errores.correoElectronico ? 'PInvalid' : ''} value={formData.correoElectronico} onChange={(e) => handleChange('correoElectronico', e.target.value)} />
          <InputText placeholder="Teléfono" className={errores.telefono ? 'PInvalid' : ''} value={formData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />
          <Password placeholder="Contraseña" feedback={false} toggleMask hideIcon="pi pi-eye" showIcon="pi pi-eye-slash" value={formData.contrasena} onChange={(e) => handleChange('contrasena', e.target.value)} className={errores.contrasena ? 'PInvalid' : ''} />
          <Password placeholder="Confirmar contraseña" feedback={false} toggleMask hideIcon="pi pi-eye" showIcon="pi pi-eye-slash" value={formData.confirmar} onChange={(e) => handleChange('confirmar', e.target.value)} className={errores.confirmar ? 'PInvalid' : ''} />

          <Button label="Siguiente" onClick={validarYEnviar} className="BtnSiguiente p-button-primary" />
        </div>
      </div>
    </div>
  );
}
