import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function EditModal({show, onHide, news, onSave}) {
    const [formData, setFormData] = useState({title: '', content: ''})

    useEffect(() => {
        if(news){
            setFormData({ title: news.title || '', content: news.content || '' })
        }
    }, [news])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData, news.id)
        onHide()

    }


  return (
    <>
      <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Редактирование новости</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Тема</Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Отменить</Button>
        <Button variant="primary" onClick={handleSubmit}>Сохранить</Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default EditModal;